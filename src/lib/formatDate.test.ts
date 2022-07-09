import { formatDate } from './formatDate'

test('formatDate()', () => {
  expect(formatDate('2021-07-03T13:09:16.000Z')).toBe('07/03/21')
  expect(formatDate('2021-07-15T18:12:03.000Z')).toBe('07/16/21')
})
