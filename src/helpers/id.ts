const ID_CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function validateIdCharacters(candidateId: string): boolean {
  return candidateId.split('').every((char) => ID_CHARACTER_SET.includes(char))
}

export function generateRandomId(): string {
  const length = 5 + Math.floor(Math.random() * 4)
  let id = ''

  for (let i = 0; i < length; i++) {
    id = id + ID_CHARACTER_SET[Math.floor(Math.random() * ID_CHARACTER_SET.length)]
  }

  return id
}
