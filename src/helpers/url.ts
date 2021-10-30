export function getShortenedUrlFromId(id: string): string {
  return `${process.env.BASE_URL}/${id}`
}
