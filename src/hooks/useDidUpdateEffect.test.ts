import { renderHook } from '@testing-library/react-hooks'

import useDidUpdateEffect from './useDidUpdateEffect'

// @TODO Skip until @testing-library/react-hooks support React 18
test.skip('useUpdateEffect simulates componentDidUpdate', () => {
  const effect = jest.fn()
  const { rerender } = renderHook(() => useDidUpdateEffect(effect))

  expect(effect).toHaveBeenCalledTimes(0)
  rerender()
  expect(effect).toHaveBeenCalledTimes(1)
  rerender()
  expect(effect).toHaveBeenCalledTimes(2)
  rerender()
  expect(effect).toHaveBeenCalledTimes(3)
})
