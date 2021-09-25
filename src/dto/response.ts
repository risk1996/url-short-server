export interface BaseSuccessResponseBody<T extends Record<string, unknown>> {
  code: 'success'
  data: T
}

export interface FailResponseBody {
  code: 'fail'
  error: { message: string }
}
