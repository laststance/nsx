import { useRef, useLayoutEffect } from 'react'
/**
 * Simulate componentDidUpdate() method of Class Component
 * https://reactjs.org/docs/react-component.html#componentdidupdate
 */
const useDidUpdateLayoutEffect = (
  effect: AnyFunction,
  deps: any[] | undefined = undefined
): void => {
  const mounted = useRef<boolean>()
  useLayoutEffect(() => {
    if (!mounted.current) {
      // fire componentDidMount
      mounted.current = true
    } else {
      effect()
    }
  }, deps)
}

export default useDidUpdateLayoutEffect
