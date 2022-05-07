import { renderHook } from '@testing-library/react-hooks'

import useDidUpdateLayoutEffect from './useDidUpdateLayoutEffect'

test('useUpdateEffect simulates componentDidUpdate', () => {
  const effect = jest.fn()
  const { rerender } = renderHook(() => useDidUpdateLayoutEffect(effect))

  expect(effect).toHaveBeenCalledTimes(0)
  rerender()
  expect(effect).toHaveBeenCalledTimes(1)
  rerender()
  expect(effect).toHaveBeenCalledTimes(2)
  rerender()
  expect(effect).toHaveBeenCalledTimes(3)
})
