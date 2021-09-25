import { Request, Response } from 'express'
import { FailResponseBody } from '../dto/response'
import DatabaseService from '../services/database'

interface AccessShortUrlRequestPathParameter {
  id: string
}

export default async function accessShortUrlHandler(
  req: Request<AccessShortUrlRequestPathParameter, FailResponseBody, never>,
  res: Response<FailResponseBody>,
) {
  const { id } = req.params

  const url = await DatabaseService.instance.getUrl(id)

  if (url === null) {
    res.status(404).send({
      code: 'fail',
      error: { message: 'not-found' }
    })
    return
  }

  await DatabaseService.instance.incrementUrlVisitCount(id)

  res.status(303).header('Location', url.originalUrl).send()
}
