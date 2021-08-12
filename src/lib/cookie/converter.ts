/* eslint-disable no-var */
export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  read: function (value: string) {
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  write: function (value: string | number | boolean) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  },
}
/* eslint-enable no-var */
