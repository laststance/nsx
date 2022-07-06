import { truncateString } from './truncateString'

test('truncateString', () => {
  const res = truncateString('Himemori Luna', 8)
  expect(res).toEqual('Himemori...')
})
