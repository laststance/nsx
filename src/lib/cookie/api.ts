/* eslint-disable no-var */
import assign from './assign'
import defaultConverter from './converter'

function init(
  converter: { read: any; write: any },
  defaultAttributes: { path: string }
) {
  function set(
    key: string | number | boolean,
    value: string,
    attributes: {
      [x: string]: string // @ts-ignore
      expires: number | Date
    }
  ) {
    if (typeof document === 'undefined') {
      return
    }

    // @ts-ignore
    attributes = assign({}, defaultAttributes, attributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      // @ts-ignore
      attributes.expires = attributes.expires.toUTCString()
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape)

    value = converter.write(value, key)

    var stringifiedAttributes = ''
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName

      // @ts-ignore
      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }

    return (document.cookie = key + '=' + value + stringifiedAttributes)
  }

  function get(key: string) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=')
      var value = parts.slice(1).join('=')

      if (value[0] === '"') {
        value = value.slice(1, -1)
      }

      try {
        var foundKey = defaultConverter.read(parts[0])
        // @ts-ignore
        jar[foundKey] = converter.read(value, foundKey)

        if (key === foundKey) {
          break
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    // @ts-ignore
    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key: string | number | boolean, attributes: any) {
        set(
          key,
          '',
          // @ts-ignore
          assign({}, attributes, {
            expires: -1,
          })
        )
      },
      withAttributes: function (attributes: any) {
        // @ts-ignore
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter: any) {
        // @ts-ignore
        return init(assign({}, this.converter, converter), this.attributes)
      },
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) },
    }
  )
}

export default init(defaultConverter, { path: '/' })
