import dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'

import accessShortUrlHandler from './handlers/access-short-url'
import createShortUrlHandler from './handlers/create-short-url'
import getShortUrlStatsHandler from './handlers/get-short-url-stats'

dotenv.config()

const app = express()

app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')

  next()
})

app.post('/short-urls', createShortUrlHandler)
app.get('/:id', accessShortUrlHandler)
app.get('/:id/stats', getShortUrlStatsHandler)

app.listen(Number(process.env.PORT))
