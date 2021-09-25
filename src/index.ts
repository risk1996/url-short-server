import express from 'express'
import accessShortUrlHandler from './handlers/access-short-url'
import createShortUrlHandler from './handlers/create-short-url'
import getShortUrlStatsHandler from './handlers/get-short-url-stats'

const app = express()

app.use(express.json())

app.post('/short-urls', createShortUrlHandler)
app.get('/:id', accessShortUrlHandler)
app.get('/:id/stats', getShortUrlStatsHandler)

app.listen(8_000)
