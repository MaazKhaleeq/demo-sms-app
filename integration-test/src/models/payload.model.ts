export interface Payload {
  providerId: string
  origin: string
  destination: string
  submitTimestamp?: number
  validityPeriod?: number
  message: Message
}

interface Message {
  length: number
  content: string
}
