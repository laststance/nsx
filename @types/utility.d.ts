// from https://github.com/reduxjs/redux-toolkit/blob/4fbd29f0032f1ebb9e2e621ab48bbff5266e312c/packages/toolkit/src/query/tsHelpers.ts

declare type Override<T1, T2> = T2 extends any ? Omit<T1, keyof T2> & T2 : never

declare type NonOptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T]

declare type HasRequiredProps<T, True, False> = NonOptionalKeys<T> extends never
  ? False
  : True

declare type OptionalIfAllPropsOptional<T> = HasRequiredProps<T, T, T | never>

declare type NoInfer<T> = [T][T extends any ? 0 : never]

declare type UnwrapPromise<T> = T extends PromiseLike<infer V> ? V : T

declare type MaybePromise<T> = T | PromiseLike<T>

declare type OmitFromUnion<T, K extends keyof T> = T extends any
  ? Omit<T, K>
  : never

declare type IsAny<T, True, False = never> = true | false extends (
  T extends never ? true : false
)
  ? True
  : False

declare type CastAny<T, CastTo> = IsAny<T, CastTo, T>

declare type Cast<T, CastTo> = NoInfer<T> extends never ? CastTo : CastTo

declare type AnyFunction = (...args: any[]) => any

declare type StateUpdator = AnyFunction

declare type QueryFunction = AnyFunction

declare type MutationFunction = AnyFunction

// skip unnecessary generics position
declare type _ = any

// from https://github.com/denoland/deno_std/issues/1126#issuecomment-900947143
declare type Typify<T> = { [K in keyof T]: T[K] }

// eslint-disable-next-line @typescript-eslint/ban-types
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
 Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

 @category Basic
 */
declare type Class<T, Arguments extends unknown[] = any[]> = Constructor<
  T,
  Arguments
> & { prototype: T }

/**
 Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

 @category Basic
 */
declare type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T

/**
 Matches a JSON object.

 This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

 @category Basic
 */
declare type JsonObject = { [Key in string]?: JsonValue }

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

 This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

 @category Basic
 */
declare type JsonObject = { [Key in string]?: JsonValue }
