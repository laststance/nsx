/* eslint-disable no-var */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (target: { [x: string]: any }) {
  for (var i = 1; i < arguments.length; i++) {
    // eslint-disable-next-line prefer-rest-params
    var source = arguments[i]
    for (var key in source) {
      target[key] = source[key]
    }
  }
  return target
}
/* eslint-enable no-var */
