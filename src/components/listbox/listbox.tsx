import type {
  // Types
  Dispatch,
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  Ref,
} from 'react'
import React, {
  Fragment,
  createContext,
  createRef,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useEffect,
} from 'react'

import { useComputed } from '../../hooks/use-computed'
import { useDisposables } from '../../hooks/use-disposables'
import { useId } from '../../hooks/use-id'
import { useIsoMorphicEffect } from '../../hooks/use-iso-morphic-effect'
import { useOutsideClick } from '../../hooks/use-outside-click'
import { useResolveButtonType } from '../../hooks/use-resolve-button-type'
import { useSyncRefs } from '../../hooks/use-sync-refs'
import { Hidden, Features as HiddenFeatures } from '../../internal/hidden'
import {
  useOpenClosed,
  State,
  OpenClosedProvider,
} from '../../internal/open-closed'
import type { Props } from '../../types'
import { isDisabledReactIssue7711 } from '../../utils/bugs'
import { Focus, calculateActiveIndex } from '../../utils/calculate-active-index'
import { disposables } from '../../utils/disposables'
import {
  isFocusableElement,
  FocusableMode,
  sortByDomNode,
} from '../../utils/focus-management'
import { objectToFormEntries } from '../../utils/form'
import { match } from '../../utils/match'
import { getOwnerDocument } from '../../utils/owner'
import { Features, forwardRefWithAs, render, compact } from '../../utils/render'
import type { PropsForFeatures } from '../../utils/render'
import { Keys } from '../keyboard'

enum ListboxStates {
  Open,
  Closed,
}

enum ValueMode {
  Single,
  Multi,
}

enum ActivationTrigger {
  Pointer,
  Other,
}

type ListboxOptionDataRef = MutableRefObject<{
  textValue?: string
  disabled: boolean
  value: unknown
  domRef: MutableRefObject<HTMLElement | null>
}>

interface StateDefinition {
  listboxState: ListboxStates

  orientation: 'horizontal' | 'vertical'

  propsRef: MutableRefObject<{
    value: unknown
    onChange(value: unknown): void
    mode: ValueMode
  }>
  labelRef: MutableRefObject<HTMLLabelElement | null>
  buttonRef: MutableRefObject<HTMLButtonElement | null>
  optionsRef: MutableRefObject<HTMLUListElement | null>

  disabled: boolean
  options: { id: string; dataRef: ListboxOptionDataRef }[]
  searchQuery: string
  activeOptionIndex: number | null
  activationTrigger: ActivationTrigger
}

enum ActionTypes {
  OpenListbox,
  CloseListbox,

  SetDisabled,
  SetOrientation,

  GoToOption,
  Search,
  ClearSearch,

  RegisterOption,
  UnregisterOption,
}

function adjustOrderedState(
  state: StateDefinition,
  adjustment: (
    options: StateDefinition['options']
  ) => StateDefinition['options'] = (i) => i
) {
  const currentActiveOption =
    state.activeOptionIndex !== null
      ? state.options[state.activeOptionIndex]
      : null

  const sortedOptions = sortByDomNode(
    adjustment(state.options.slice()),
    (option) => option.dataRef.current.domRef.current
  )

  // If we inserted an option before the current active option then the active option index
  // would be wrong. To fix this, we will re-lookup the correct index.
  let adjustedActiveOptionIndex = currentActiveOption
    ? sortedOptions.indexOf(currentActiveOption)
    : null

  // Reset to `null` in case the currentActiveOption was removed.
  if (adjustedActiveOptionIndex === -1) {
    adjustedActiveOptionIndex = null
  }

  return {
    activeOptionIndex: adjustedActiveOptionIndex,
    options: sortedOptions,
  }
}

type Actions =
  | { type: ActionTypes.CloseListbox }
  | { type: ActionTypes.OpenListbox }
  | { type: ActionTypes.SetDisabled; disabled: boolean }
  | {
      type: ActionTypes.SetOrientation
      orientation: StateDefinition['orientation']
    }
  | {
      type: ActionTypes.GoToOption
      focus: Focus.Specific
      id: string
      trigger?: ActivationTrigger
    }
  | {
      type: ActionTypes.GoToOption
      focus: Exclude<Focus, Focus.Specific>
      trigger?: ActivationTrigger
    }
  | { type: ActionTypes.Search; value: string }
  | { type: ActionTypes.ClearSearch }
  | {
      type: ActionTypes.RegisterOption
      id: string
      dataRef: ListboxOptionDataRef
    }
  | { type: ActionTypes.UnregisterOption; id: string }

const reducers: {
  [P in ActionTypes]: (
    state: StateDefinition,
    action: Extract<Actions, { type: P }>
  ) => StateDefinition
} = {
  [ActionTypes.CloseListbox](state) {
    if (state.disabled) return state
    if (state.listboxState === ListboxStates.Closed) return state
    return {
      ...state,
      activeOptionIndex: null,
      listboxState: ListboxStates.Closed,
    }
  },
  [ActionTypes.OpenListbox](state) {
    if (state.disabled) return state
    if (state.listboxState === ListboxStates.Open) return state

    // Check if we have a selected value that we can make active
    let activeOptionIndex = state.activeOptionIndex
    const { value, mode } = state.propsRef.current
    const optionIdx = state.options.findIndex((option) => {
      const optionValue = option.dataRef.current.value
      const selected = match(mode, {
        [ValueMode.Multi]: () => (value as unknown[]).includes(optionValue),
        [ValueMode.Single]: () => value === optionValue,
      })

      return selected
    })

    if (optionIdx !== -1) {
      activeOptionIndex = optionIdx
    }

    return { ...state, activeOptionIndex, listboxState: ListboxStates.Open }
  },
  [ActionTypes.SetDisabled](state, action) {
    if (state.disabled === action.disabled) return state
    return { ...state, disabled: action.disabled }
  },
  [ActionTypes.SetOrientation](state, action) {
    if (state.orientation === action.orientation) return state
    return { ...state, orientation: action.orientation }
  },
  [ActionTypes.GoToOption](state, action) {
    if (state.disabled) return state
    if (state.listboxState === ListboxStates.Closed) return state

    const adjustedState = adjustOrderedState(state)
    const activeOptionIndex = calculateActiveIndex(action, {
      resolveActiveIndex: () => adjustedState.activeOptionIndex,
      resolveDisabled: (option) => option.dataRef.current.disabled,
      resolveId: (option) => option.id,
      resolveItems: () => adjustedState.options,
    })

    return {
      ...state,
      ...adjustedState,
      activationTrigger: action.trigger ?? ActivationTrigger.Other,
      activeOptionIndex,
      searchQuery: '',
    }
  },
  [ActionTypes.Search]: (state, action) => {
    if (state.disabled) return state
    if (state.listboxState === ListboxStates.Closed) return state

    const wasAlreadySearching = state.searchQuery !== ''
    const offset = wasAlreadySearching ? 0 : 1

    const searchQuery = state.searchQuery + action.value.toLowerCase()

    const reOrderedOptions =
      state.activeOptionIndex !== null
        ? state.options
            .slice(state.activeOptionIndex + offset)
            .concat(state.options.slice(0, state.activeOptionIndex + offset))
        : state.options

    const matchingOption = reOrderedOptions.find(
      (option) =>
        !option.dataRef.current.disabled &&
        option.dataRef.current.textValue?.startsWith(searchQuery)
    )

    const matchIdx = matchingOption ? state.options.indexOf(matchingOption) : -1

    if (matchIdx === -1 || matchIdx === state.activeOptionIndex)
      return { ...state, searchQuery }
    return {
      ...state,
      activationTrigger: ActivationTrigger.Other,
      activeOptionIndex: matchIdx,
      searchQuery,
    }
  },
  [ActionTypes.ClearSearch](state) {
    if (state.disabled) return state
    if (state.listboxState === ListboxStates.Closed) return state
    if (state.searchQuery === '') return state
    return { ...state, searchQuery: '' }
  },
  [ActionTypes.RegisterOption]: (state, action) => {
    const option = { dataRef: action.dataRef, id: action.id }
    const adjustedState = adjustOrderedState(state, (options) => [
      ...options,
      option,
    ])

    // Check if we need to make the newly registered option active.
    if (state.activeOptionIndex === null) {
      const { value, mode } = state.propsRef.current
      const optionValue = action.dataRef.current.value
      const selected = match(mode, {
        [ValueMode.Multi]: () => (value as unknown[]).includes(optionValue),
        [ValueMode.Single]: () => value === optionValue,
      })
      if (selected) {
        adjustedState.activeOptionIndex = adjustedState.options.indexOf(option)
      }
    }

    return { ...state, ...adjustedState }
  },
  [ActionTypes.UnregisterOption]: (state, action) => {
    const adjustedState = adjustOrderedState(state, (options) => {
      const idx = options.findIndex((a) => a.id === action.id)
      if (idx !== -1) options.splice(idx, 1)
      return options
    })

    return {
      ...state,
      ...adjustedState,
      activationTrigger: ActivationTrigger.Other,
    }
  },
}

const ListboxContext = createContext<
  [StateDefinition, Dispatch<Actions>] | null
>(null)
ListboxContext.displayName = 'ListboxContext'

function useListboxContext(component: string) {
  const context = useContext(ListboxContext)
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Listbox /> component.`
    )
    if (Error.captureStackTrace) Error.captureStackTrace(err, useListboxContext)
    throw err
  }
  return context
}

function stateReducer(state: StateDefinition, action: Actions) {
  return match(action.type, reducers, state, action)
}

// ---

const DEFAULT_LISTBOX_TAG = Fragment
interface ListboxRenderPropArg {
  open: boolean
  disabled: boolean
}

const ListboxRoot = forwardRefWithAs(function Listbox<
  TTag extends ElementType = typeof DEFAULT_LISTBOX_TAG,
  TType = string,
  TActualType = TType extends (infer U)[] ? U : TType
>(
  props: Props<
    TTag,
    ListboxRenderPropArg,
    'value' | 'onChange' | 'disabled' | 'horizontal' | 'name' | 'multiple'
  > & {
    value: TType
    onChange(value: TType): void
    disabled?: boolean
    horizontal?: boolean
    name?: string
    multiple?: boolean
  },
  ref: Ref<TTag>
) {
  const {
    value,
    name,
    onChange,
    disabled = false,
    horizontal = false,
    multiple = false,
    ...theirProps
  } = props
  const orientation = horizontal ? 'horizontal' : 'vertical'
  const listboxRef = useSyncRefs(ref)

  const reducerBag = useReducer(stateReducer, {
    activationTrigger: ActivationTrigger.Other,
    activeOptionIndex: null,
    buttonRef: createRef(),
    disabled,
    labelRef: createRef(),
    listboxState: ListboxStates.Closed,
    options: [],
    optionsRef: createRef(),
    orientation,
    propsRef: {
      current: {
        mode: multiple ? ValueMode.Multi : ValueMode.Single,
        onChange,
        value,
      },
    },
    searchQuery: '',
  } as StateDefinition)
  const [{ listboxState, propsRef, optionsRef, buttonRef }, dispatch] =
    reducerBag

  propsRef.current.value = value
  propsRef.current.mode = multiple ? ValueMode.Multi : ValueMode.Single

  useIsoMorphicEffect(() => {
    propsRef.current.onChange = (value: unknown) => {
      return match(propsRef.current.mode, {
        [ValueMode.Single]() {
          return onChange(value as TType)
        },
        [ValueMode.Multi]() {
          const copy = (propsRef.current.value as TActualType[]).slice()

          const idx = copy.indexOf(value as TActualType)
          if (idx === -1) {
            copy.push(value as TActualType)
          } else {
            copy.splice(idx, 1)
          }

          return onChange(copy as unknown as TType)
        },
      })
    }
  }, [onChange, propsRef])
  useIsoMorphicEffect(
    () => dispatch({ disabled, type: ActionTypes.SetDisabled }),
    [disabled]
  )
  useIsoMorphicEffect(
    () => dispatch({ orientation, type: ActionTypes.SetOrientation }),
    [orientation]
  )

  // Handle outside click
  useOutsideClick([buttonRef, optionsRef], (event, target) => {
    if (listboxState !== ListboxStates.Open) return

    dispatch({ type: ActionTypes.CloseListbox })

    if (!isFocusableElement(target, FocusableMode.Loose)) {
      event.preventDefault()
      buttonRef.current?.focus()
    }
  })

  const slot = useMemo<ListboxRenderPropArg>(
    () => ({ disabled, open: listboxState === ListboxStates.Open }),
    [listboxState, disabled]
  )

  const ourProps = { ref: listboxRef }

  return (
    <ListboxContext.Provider value={reducerBag}>
      <OpenClosedProvider
        value={match(listboxState, {
          [ListboxStates.Open]: State.Open,
          [ListboxStates.Closed]: State.Closed,
        })}
      >
        {name != null &&
          value != null &&
          objectToFormEntries({ [name]: value }).map(([name, value]) => (
            <Hidden
              features={HiddenFeatures.Hidden}
              {...compact({
                as: 'input',
                hidden: true,
                key: name,
                name,
                readOnly: true,
                type: 'hidden',
                value,
              })}
            />
          ))}
        {render({
          defaultTag: DEFAULT_LISTBOX_TAG,
          name: 'Listbox',
          ourProps,
          slot,
          theirProps,
        })}
      </OpenClosedProvider>
    </ListboxContext.Provider>
  )
})

// ---

const DEFAULT_BUTTON_TAG = 'button' as const
interface ButtonRenderPropArg {
  open: boolean
  disabled: boolean
}
type ButtonPropsWeControl =
  | 'id'
  | 'type'
  | 'aria-haspopup'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-labelledby'
  | 'disabled'
  | 'onKeyDown'
  | 'onClick'

const Button = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_BUTTON_TAG
>(
  props: Props<TTag, ButtonRenderPropArg, ButtonPropsWeControl>,
  ref: Ref<HTMLButtonElement>
) {
  const [state, dispatch] = useListboxContext('Listbox.Button')
  const buttonRef = useSyncRefs(state.buttonRef, ref)

  const id = `headlessui-listbox-button-${useId()}`
  const d = useDisposables()

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13

        case Keys.Space:
        case Keys.Enter:
        case Keys.ArrowDown:
          event.preventDefault()
          dispatch({ type: ActionTypes.OpenListbox })
          d.nextFrame(() => {
            if (!state.propsRef.current.value)
              dispatch({ focus: Focus.First, type: ActionTypes.GoToOption })
          })
          break

        case Keys.ArrowUp:
          event.preventDefault()
          dispatch({ type: ActionTypes.OpenListbox })
          d.nextFrame(() => {
            if (!state.propsRef.current.value)
              dispatch({ focus: Focus.Last, type: ActionTypes.GoToOption })
          })
          break
      }
    },
    [dispatch, state, d]
  )

  const handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
          // Required for firefox, event.preventDefault() in handleKeyDown for
          // the Space key doesn't cancel the handleKeyUp, which in turn
          // triggers a *click*.
          event.preventDefault()
          break
      }
    },
    []
  )

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget))
        return event.preventDefault()
      if (state.listboxState === ListboxStates.Open) {
        dispatch({ type: ActionTypes.CloseListbox })
        d.nextFrame(() =>
          state.buttonRef.current?.focus({ preventScroll: true })
        )
      } else {
        event.preventDefault()
        dispatch({ type: ActionTypes.OpenListbox })
      }
    },
    [dispatch, d, state]
  )

  const labelledby = useComputed(() => {
    if (!state.labelRef.current) return undefined
    return [state.labelRef.current.id, id].join(' ')
  }, [state.labelRef.current, id])

  const slot = useMemo<ButtonRenderPropArg>(
    () => ({
      disabled: state.disabled,
      open: state.listboxState === ListboxStates.Open,
    }),
    [state]
  )
  const theirProps = props
  const ourProps = {
    'aria-controls': state.optionsRef.current?.id,
    'aria-expanded': state.disabled
      ? undefined
      : state.listboxState === ListboxStates.Open,
    'aria-haspopup': true,
    'aria-labelledby': labelledby,
    disabled: state.disabled,
    id,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    ref: buttonRef,
    type: useResolveButtonType(props, state.buttonRef),
  }

  return render({
    defaultTag: DEFAULT_BUTTON_TAG,
    name: 'Listbox.Button',
    ourProps,
    slot,
    theirProps,
  })
})

// ---

const DEFAULT_LABEL_TAG = 'label' as const
interface LabelRenderPropArg {
  open: boolean
  disabled: boolean
}
type LabelPropsWeControl = 'id' | 'ref' | 'onClick'

const Label = forwardRefWithAs(function Label<
  TTag extends ElementType = typeof DEFAULT_LABEL_TAG
>(
  props: Props<TTag, LabelRenderPropArg, LabelPropsWeControl>,
  ref: Ref<HTMLElement>
) {
  const [state] = useListboxContext('Listbox.Label')
  const id = `headlessui-listbox-label-${useId()}`
  const labelRef = useSyncRefs(state.labelRef, ref)

  const handleClick = useCallback(
    () => state.buttonRef.current?.focus({ preventScroll: true }),
    [state.buttonRef]
  )

  const slot = useMemo<LabelRenderPropArg>(
    () => ({
      disabled: state.disabled,
      open: state.listboxState === ListboxStates.Open,
    }),
    [state]
  )
  const theirProps = props
  const ourProps = { id, onClick: handleClick, ref: labelRef }

  return render({
    defaultTag: DEFAULT_LABEL_TAG,
    name: 'Listbox.Label',
    ourProps,
    slot,
    theirProps,
  })
})

// ---

const DEFAULT_OPTIONS_TAG = 'ul' as const
interface OptionsRenderPropArg {
  open: boolean
}
type OptionsPropsWeControl =
  | 'aria-activedescendant'
  | 'aria-labelledby'
  | 'aria-orientation'
  | 'id'
  | 'onKeyDown'
  | 'role'
  | 'tabIndex'

const OptionsRenderFeatures = Features.RenderStrategy | Features.Static

const Options = forwardRefWithAs(function Options<
  TTag extends ElementType = typeof DEFAULT_OPTIONS_TAG
>(
  props: Props<TTag, OptionsRenderPropArg, OptionsPropsWeControl> &
    PropsForFeatures<typeof OptionsRenderFeatures>,
  ref: Ref<HTMLElement>
) {
  const [state, dispatch] = useListboxContext('Listbox.Options')
  const optionsRef = useSyncRefs(state.optionsRef, ref)

  const id = `headlessui-listbox-options-${useId()}`
  const d = useDisposables()
  const searchDisposables = useDisposables()

  const usesOpenClosedState = useOpenClosed()
  const visible = (() => {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open
    }

    return state.listboxState === ListboxStates.Open
  })()

  useEffect(() => {
    const container = state.optionsRef.current
    if (!container) return
    if (state.listboxState !== ListboxStates.Open) return
    if (container === getOwnerDocument(container)?.activeElement) return

    container.focus({ preventScroll: true })
  }, [state.listboxState, state.optionsRef])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLUListElement>) => {
      searchDisposables.dispose()

      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12

        // @ts-expect-error Fallthrough is expected here
        case Keys.Space:
          if (state.searchQuery !== '') {
            event.preventDefault()
            event.stopPropagation()
            return dispatch({ type: ActionTypes.Search, value: event.key })
          }
        // When in type ahead mode, fallthrough
        case Keys.Enter:
          event.preventDefault()
          event.stopPropagation()

          if (state.activeOptionIndex !== null) {
            const { dataRef } = state.options[state.activeOptionIndex]
            state.propsRef.current.onChange(dataRef.current.value)
          }
          if (state.propsRef.current.mode === ValueMode.Single) {
            dispatch({ type: ActionTypes.CloseListbox })
            disposables().nextFrame(() =>
              state.buttonRef.current?.focus({ preventScroll: true })
            )
          }
          break

        case match(state.orientation, {
          horizontal: Keys.ArrowRight,
          vertical: Keys.ArrowDown,
        }):
          event.preventDefault()
          event.stopPropagation()
          return dispatch({ focus: Focus.Next, type: ActionTypes.GoToOption })

        case match(state.orientation, {
          horizontal: Keys.ArrowLeft,
          vertical: Keys.ArrowUp,
        }):
          event.preventDefault()
          event.stopPropagation()
          return dispatch({
            focus: Focus.Previous,
            type: ActionTypes.GoToOption,
          })

        case Keys.Home:
        case Keys.PageUp:
          event.preventDefault()
          event.stopPropagation()
          return dispatch({ focus: Focus.First, type: ActionTypes.GoToOption })

        case Keys.End:
        case Keys.PageDown:
          event.preventDefault()
          event.stopPropagation()
          return dispatch({ focus: Focus.Last, type: ActionTypes.GoToOption })

        case Keys.Escape:
          event.preventDefault()
          event.stopPropagation()
          dispatch({ type: ActionTypes.CloseListbox })
          return d.nextFrame(() =>
            state.buttonRef.current?.focus({ preventScroll: true })
          )

        case Keys.Tab:
          event.preventDefault()
          event.stopPropagation()
          break

        default:
          if (event.key.length === 1) {
            dispatch({ type: ActionTypes.Search, value: event.key })
            searchDisposables.setTimeout(
              () => dispatch({ type: ActionTypes.ClearSearch }),
              350
            )
          }
          break
      }
    },
    [d, dispatch, searchDisposables, state]
  )

  const labelledby = useComputed(
    () => state.labelRef.current?.id ?? state.buttonRef.current?.id,
    [state.labelRef.current, state.buttonRef.current]
  )

  const slot = useMemo<OptionsRenderPropArg>(
    () => ({ open: state.listboxState === ListboxStates.Open }),
    [state]
  )

  const theirProps = props
  const ourProps = {
    'aria-activedescendant':
      state.activeOptionIndex === null
        ? undefined
        : state.options[state.activeOptionIndex]?.id,
    'aria-labelledby': labelledby,
    'aria-multiselectable':
      state.propsRef.current.mode === ValueMode.Multi ? true : undefined,
    'aria-orientation': state.orientation,
    id,
    onKeyDown: handleKeyDown,
    ref: optionsRef,
    role: 'listbox',
    tabIndex: 0,
  }

  return render({
    defaultTag: DEFAULT_OPTIONS_TAG,
    features: OptionsRenderFeatures,
    name: 'Listbox.Options',
    ourProps,
    slot,
    theirProps,
    visible,
  })
})

// ---

const DEFAULT_OPTION_TAG = 'li' as const
interface OptionRenderPropArg {
  active: boolean
  selected: boolean
  disabled: boolean
}
type ListboxOptionPropsWeControl =
  | 'id'
  | 'role'
  | 'tabIndex'
  | 'aria-disabled'
  | 'aria-selected'
  | 'onPointerLeave'
  | 'onMouseLeave'
  | 'onPointerMove'
  | 'onMouseMove'
  | 'onFocus'

const Option = forwardRefWithAs(function Option<
  TTag extends ElementType = typeof DEFAULT_OPTION_TAG,
  // TODO: One day we will be able to infer this type from the generic in Listbox itself.
  // But today is not that day..
  TType = Parameters<typeof ListboxRoot>[0]['value']
>(
  props: Props<
    TTag,
    OptionRenderPropArg,
    ListboxOptionPropsWeControl | 'value'
  > & {
    disabled?: boolean
    value: TType
  },
  ref: Ref<HTMLElement>
) {
  const { disabled = false, value, ...theirProps } = props
  const [state, dispatch] = useListboxContext('Listbox.Option')
  const id = `headlessui-listbox-option-${useId()}`
  const active =
    state.activeOptionIndex !== null
      ? state.options[state.activeOptionIndex].id === id
      : false
  const selected = match(state.propsRef.current.mode, {
    [ValueMode.Multi]: () =>
      (state.propsRef.current.value as TType[]).includes(value),
    [ValueMode.Single]: () => state.propsRef.current.value === value,
  })

  const internalOptionRef = useRef<HTMLLIElement | null>(null)
  const optionRef = useSyncRefs(ref, internalOptionRef)

  useIsoMorphicEffect(() => {
    if (state.listboxState !== ListboxStates.Open) return
    if (!active) return
    if (state.activationTrigger === ActivationTrigger.Pointer) return
    const d = disposables()
    d.requestAnimationFrame(() => {
      internalOptionRef.current?.scrollIntoView?.({ block: 'nearest' })
    })
    return d.dispose
  }, [internalOptionRef, active, state.listboxState, state.activationTrigger, /* We also want to trigger this when the position of the active item changes so that we can re-trigger the scrollIntoView */ state.activeOptionIndex])

  const bag = useRef<ListboxOptionDataRef['current']>({
    disabled,
    domRef: internalOptionRef,
    value,
  })

  useIsoMorphicEffect(() => {
    bag.current.disabled = disabled
  }, [bag, disabled])
  useIsoMorphicEffect(() => {
    bag.current.value = value
  }, [bag, value])
  useIsoMorphicEffect(() => {
    bag.current.textValue =
      internalOptionRef.current?.textContent?.toLowerCase()
  }, [bag, internalOptionRef])

  const select = useCallback(
    () => state.propsRef.current.onChange(value),
    [state.propsRef, value]
  )

  useIsoMorphicEffect(() => {
    dispatch({ dataRef: bag, id, type: ActionTypes.RegisterOption })
    return () => dispatch({ id, type: ActionTypes.UnregisterOption })
  }, [bag, id])

  const handleClick = useCallback(
    (event: { preventDefault: Function }) => {
      if (disabled) return event.preventDefault()
      select()
      if (state.propsRef.current.mode === ValueMode.Single) {
        dispatch({ type: ActionTypes.CloseListbox })
        disposables().nextFrame(() =>
          state.buttonRef.current?.focus({ preventScroll: true })
        )
      }
    },
    [dispatch, state.buttonRef, disabled, select]
  )

  const handleFocus = useCallback(() => {
    if (disabled)
      return dispatch({ focus: Focus.Nothing, type: ActionTypes.GoToOption })
    dispatch({ focus: Focus.Specific, id, type: ActionTypes.GoToOption })
  }, [disabled, id, dispatch])

  const handleMove = useCallback(() => {
    if (disabled) return
    if (active) return
    dispatch({
      focus: Focus.Specific,
      id,
      trigger: ActivationTrigger.Pointer,
      type: ActionTypes.GoToOption,
    })
  }, [disabled, active, id, dispatch])

  const handleLeave = useCallback(() => {
    if (disabled) return
    if (!active) return
    dispatch({ focus: Focus.Nothing, type: ActionTypes.GoToOption })
  }, [disabled, active, dispatch])

  const slot = useMemo<OptionRenderPropArg>(
    () => ({ active, disabled, selected }),
    [active, selected, disabled]
  )
  const ourProps = {
    'aria-disabled': disabled === true ? true : undefined,
    // According to the WAI-ARIA best practices, we should use aria-checked for
    // multi-select,but Voice-Over disagrees. So we use aria-checked instead for
    // both single and multi-select.
    'aria-selected': selected === true ? true : undefined,

    disabled: undefined,

    id,

    // Never forward the `disabled` prop
    onClick: handleClick,

    onFocus: handleFocus,

    onMouseLeave: handleLeave,
    onMouseMove: handleMove,
    onPointerLeave: handleLeave,
    onPointerMove: handleMove,
    ref: optionRef,
    role: 'option',
    tabIndex: disabled === true ? undefined : -1,
  }

  return render({
    defaultTag: DEFAULT_OPTION_TAG,
    name: 'Listbox.Option',
    ourProps,
    slot,
    theirProps,
  })
})

// ---

export const Listbox = Object.assign(ListboxRoot, {
  Button,
  Label,
  Option,
  Options,
})
