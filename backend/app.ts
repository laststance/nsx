import Express, { Request, Response } from 'express'
import cors from 'cors'
const app = Express()
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Express server is working!' })
})

export default app
