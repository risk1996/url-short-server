import { Request, Response } from 'express'
import { ValidationError } from 'sequelize'
import { BaseSuccessResponseBody, FailResponseBody } from '../dto/response'
import { generateRandomId, validateIdCharacters } from '../helpers/id'
import { getShortenedUrlFromId } from '../helpers/url'
import DatabaseService from '../services/database'

interface CreateShortUrlRequestBody {
  id?: string
  originalUrl: string
}

type SuccessCreateShortUrlResponseBody = BaseSuccessResponseBody<{
  originalUrl: string
  shortenedUrl: string
}>

type CreateShortUrlResponseBody =
  | SuccessCreateShortUrlResponseBody
  | FailResponseBody

export default async function createShortUrlHandler(
  req: Request<Record<never, never>, CreateShortUrlResponseBody, CreateShortUrlRequestBody>,
  res: Response<CreateShortUrlResponseBody>,
) {
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

    await DatabaseService.instance.insertUrl({ id, isCustom, originalUrl: req.body.originalUrl })

    res.status(201).send({
      code: 'success',
      data: {
        originalUrl: req.body.originalUrl,
        shortenedUrl: getShortenedUrlFromId(id),
      },
    })
  } catch (e) {
    if (e instanceof ValidationError && e.errors[0].message === 'id must be unique') {
      res.status(409).send({
        code: 'fail',
        error: { message: 'id-reserved' }
      })
      return
    }

    res.status(500).send({
      code: 'fail',
      error: { message: e instanceof Error ? e.message : 'unhandled-exception' }
    })
  }
}
