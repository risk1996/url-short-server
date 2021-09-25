const ID_CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function validateIdCharacters(candidateId: string): boolean {
  return candidateId.split('').every((char) => ID_CHARACTER_SET.includes(char))
}

export function generateRandomId(): string {
  return new Array(5 + Math.floor(Math.random() * 4))
    .map(() => ID_CHARACTER_SET[Math.floor(Math.random() * ID_CHARACTER_SET.length)])
    .join('')
}
