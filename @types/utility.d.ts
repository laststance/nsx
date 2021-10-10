// from https://github.com/reduxjs/redux-toolkit/blob/4fbd29f0032f1ebb9e2e621ab48bbff5266e312c/packages/toolkit/src/query/tsHelpers.ts
declare type Id<T> = { [K in keyof T]: T[K] } & Record<string, unknown>

declare type WithRequiredProp<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

declare type Override<T1, T2> = T2 extends any ? Omit<T1, keyof T2> & T2 : never

/**
 * Convert a Union type `(A|B)` to an intersection type `(A&B)`
 */
declare type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

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
