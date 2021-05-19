// @see https://ultimatecourses.com/blog/all-about-immutable-arrays-and-objects-in-javascript

type PopReturnType = [lastItem: unknown, lastItemRemovedArray: Array<unknown>]
type ShiftReturnType = [
  firstItem: unknown,
  firstItemRemovedArray: Array<unknown>
]

export interface ImmutableArrayInterface {
  push(existing: Array<unknown>, newItem: unknown): Array<unknown>
  unshift(existing: Array<unknown>, newItem: unknown): Array<unknown>
  pop(arr: Array<unknown>): PopReturnType
  shift(arr: Array<unknown>): ShiftReturnType
}

const ImmutableArray: ImmutableArrayInterface = {
  push(existing: Array<unknown>, newItem: unknown): Array<unknown> {
    return [...existing, newItem]
  },

  unshift(existing: Array<unknown>, newItem: unknown): Array<unknown> {
    return [newItem, ...existing]
  },

  pop(arr: Array<unknown>): PopReturnType {
    const lastItem = arr[arr.length - 1]
    const lastItemRemovedArray = arr.slice(0, arr.length - 1)
    return [lastItem, lastItemRemovedArray]
  },

  shift(arr: Array<unknown>): ShiftReturnType {
    const firstItem = arr[0]
    const firstItemRemovedArray = arr.slice(1)
    return [firstItem, firstItemRemovedArray]
  },
}

export default ImmutableArray
