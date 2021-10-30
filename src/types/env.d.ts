declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      /** The URL for the front-end application */
      CONSUMER_URL: string

      /** The network port this service is running on */
      PORT: string

      /** The base URL the service will be hosted on */
      BASE_URL: string
    }
  }
}

export {}
