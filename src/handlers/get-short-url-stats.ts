import { Request, Response } from 'express'
import { BaseSuccessResponseBody, FailResponseBody } from '../dto/response'
import { getShortenedUrlFromId } from '../helpers/url'
import DatabaseService from '../services/database'

interface GetShortUrlStatisticsRequestPathParameters {
  id: string
}

type SuccessGetUrlStatisticsResponseBody = BaseSuccessResponseBody<{
  createdAt: string
  isCustom: boolean
  originalUrl: string
  shortenedUrl: string
  visitCount: number
}>

type GetUrlStatisticsResponseBody = SuccessGetUrlStatisticsResponseBody | FailResponseBody

export default async function getShortUrlStatsHandler(
  req: Request<GetShortUrlStatisticsRequestPathParameters, GetUrlStatisticsResponseBody, never>,
  res: Response<GetUrlStatisticsResponseBody>,
) {
  const  { id } = req.params
  
  const url = await DatabaseService.instance.getUrl(id)

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
      createdAt: url.createdAt.toString(),
      isCustom: url.isCustom,
      originalUrl: url.originalUrl,
      shortenedUrl: getShortenedUrlFromId(id),
      visitCount: url.visitCount,
    }
  })
}
