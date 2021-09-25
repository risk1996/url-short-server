import express, { Response, Request } from 'express'
import { generateRandomId, validateIdCharacters } from './helpers/id'
import DatabaseService from './services/database'

const app = express()
const db = new DatabaseService()

app.use(express.json())

interface CreateShortUrlRequestBody {
  id?: string
  originalUrl: string
}

interface SuccessCreateShortUrlResponseBody {
  code: 'success'
  originalUrl: string
  shortenedUrl: string
}

interface FailCreateShortUrlResponseBody {
  code: 'fail'
  error: { message: string }
}

type CreateShortUrlResponseBody = SuccessCreateShortUrlResponseBody | FailCreateShortUrlResponseBody

app.post('/short-urls', async (
  req: Request<{}, CreateShortUrlResponseBody, CreateShortUrlRequestBody>,
  res: Response<CreateShortUrlResponseBody>,
) => {
  if (typeof req.body.originalUrl !== 'string') {
    res.status(400).send({
      code: 'fail',
      error: { message: 'invalid-original-url' },
    })
    return
  }

  if (typeof req.body.id === 'string') {
    if (req.body.id.length < 5) {
      res.status(400).send({
        code: 'fail',
        error: { message: 'id-too-short' },
      })
      return
    } else if (req.body.id.length > 128) {
      res.status(400).send({
        code: 'fail',
        error: { message: 'id-too-long' },
      })
      return
    } else if (!validateIdCharacters(req.body.id)) {
      res.status(400).send({
        code: 'fail',
        error: { message: 'id-not-alphanumeric' },
      })
      return
    }
  }

  try {
    const isCustom = typeof req.body.id === 'string'
    const id = typeof req.body.id === 'string' ? req.body.id : generateRandomId()

    await db.insertUrl({ id, isCustom, originalUrl: req.body.originalUrl })

    res.status(201).send({
      code: 'success',
      originalUrl: req.body.originalUrl,
      shortenedUrl: `http://localhost:8000/${id}`
    })
  } catch (e) {
    res.status(500).send({
      code: 'fail',
      error: { message: e instanceof Error ? e.message : 'unhandled-exception' }
    })
  }
})

interface AccessShortUrlRequestPathParameter {
  id: string
}

interface FailAccessShortUrlResponseBody {
  code: 'fail'
  error: { message: string }
}

app.get('/:id', async (
  req: Request<AccessShortUrlRequestPathParameter, FailAccessShortUrlResponseBody, never>,
  res: Response<FailAccessShortUrlResponseBody>,
) => {
  const { id } = req.params

  const url = await db.getUrl(id)

  if (url === null) {
    res.status(404).send({
      code: 'fail',
      error: { message: 'not-found' }
    })
    return
  }

  await db.incrementUrlVisitCount(id)

  res.status(303).header('Location', url.getDataValue('originalUrl')).send()
})

interface GetShortUrlStatisticsRequestPathParameters {
  id: string
}

interface SuccessGetUrlStatisticsResponseBody {
  code: 'success'
  data: {
    createdAt: string
    isCustom: boolean
    originalUrl: string
    shortUrl: string
    visitCount: number
  }
}

interface FailedGetUrlStatisticsResponseBody {
  code: 'fail'
  error: { message: string }
}

type GetUrlStatisticsResponseBody = SuccessGetUrlStatisticsResponseBody | FailedGetUrlStatisticsResponseBody

app.get('/:id/stats', async (
  req: Request<GetShortUrlStatisticsRequestPathParameters, GetUrlStatisticsResponseBody, never>,
  res: Response<GetUrlStatisticsResponseBody>,
) => {
  const  { id } = req.params
  
  const url = await db.getUrl(id)

  if (url === null) {
    res.status(404).send({
      code: 'fail',
      error: { message: 'not-found' }
    })
    return
  }

  res.status(200).send({
    code: 'success',
    data: {
      createdAt: url.getDataValue('createdAt').toString(),
      isCustom: url.getDataValue('isCustom'),
      originalUrl: url.getDataValue('originalUrl'),
      shortUrl: `http://localhost:8000/${id}`,
      visitCount: url.getDataValue('visitCount'),
    }
  })
})

app.listen(8_000)
