import { rest } from 'msw'

export const handlers = [
  rest.get('/post_list', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.get('/post/:id', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.delete('/post/:id', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.post('/signup', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.post('/login', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.get('/logout', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.post('/create', (req, res, ctx) => {
    return res(ctx.body())
  }),
  rest.post('/update', (req, res, ctx) => {
    return res(ctx.body())
  }),
]
