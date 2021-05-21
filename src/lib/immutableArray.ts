/* eslint-disable @typescript-eslint/no-explicit-any */
// @see https://ultimatecourses.com/blog/all-about-immutable-arrays-and-objects-in-javascript

type PopReturnType = [lastItem: any, lastItemRemovedArray: Array<any>]
type ShiftReturnType = [firstItem: any, firstItemRemovedArray: Array<any>]

export interface ImmutableArrayInterface {
  push(existing: Array<any>, newItem: any): Array<any>
  unshift(existing: Array<any>, newItem: any): Array<any>
  pop(arr: Array<any>): PopReturnType
  shift<T = any>(arr: Array<T>): ShiftReturnType
}

const ImmutableArray: ImmutableArrayInterface = {
  push(existing: Array<any>, newItem: any): Array<any> {
    return [...existing, newItem]
  },

  unshift(existing: Array<any>, newItem: any): Array<any> {
    return [newItem, ...existing]
  },

  pop(arr: Array<any>): PopReturnType {
    const lastItem = arr[arr.length - 1]
    const lastItemRemovedArray = arr.slice(0, arr.length - 1)
    return [lastItem, lastItemRemovedArray]
  },

  shift(arr: Array<any>): ShiftReturnType {
    const firstItem = arr[0]
    const firstItemRemovedArray = arr.slice(1)
    return [firstItem, firstItemRemovedArray]
  },
}

export default ImmutableArray
