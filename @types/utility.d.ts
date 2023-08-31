// from https://github.com/reduxjs/redux-toolkit/blob/4fbd29f0032f1ebb9e2e621ab48bbff5266e312c/packages/toolkit/src/query/tsHelpers.ts
declare type Override<T1, T2> = T2 extends any ? Omit<T1, keyof T2> & T2 : never

declare type NoInfer<T> = [T][T extends any ? 0 : never]

declare type Cast<T, CastTo> = NoInfer<T> extends never ? CastTo : CastTo

declare type AnyFunction = (...args: any[]) => any

// skip unnecessary generics position
declare type _ = any

declare type VoidFunciton = (...args: any[]) => void

declare type IndexSignature<O extends object> = {
  [P in keyof O]: O[P]
}

/**
 Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 */
declare type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint

/**
 Matches a JSON array.

 @category Basic
 */
declare type JsonArray = JsonValue[]

/**
 Matches any valid JSON primitive value.

 @category Basic
 */
declare type JsonPrimitive = string | number | boolean | null

/**
 Matches any valid JSON value.

 @see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.

 @category Basic
 */
declare type JsonValue = JsonPrimitive | JsonObject | JsonArray

/**
 Matches a JSON object.

 This type can be usxeful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

 @category Basic
 */
declare type JsonObject = { [Key in string]?: JsonValue }

// https://www.youtube.com/shorts/2lCCKiWGlC0
declare type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

declare type ArrayMapCallback = Parameters<Array<any>['map']>[0]
declare type ArrayMapIndex = Parameters<ArrayMapCallback>[1]
