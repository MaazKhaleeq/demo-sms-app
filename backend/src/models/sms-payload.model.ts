export interface SMSPayloadDataStructure {
  providerId: string
  origin: string
  destination: string
  submitTimestamp?: number
  validityPeriod?: number
  message: MessageDataStructure
  deliveryStatus?: DeliveryStatusDataStructure
}

interface MessageDataStructure {
  length: number
  content: string
}

interface DeliveryStatusDataStructure {
  // 0 for Received, 1 for Queued, 2 for Pending, 3 for Undeliverable, 4 for Requeued, 5 for Delivered
  status: number
  error?: string
}

const ADDRESS_REGEX = /^\+[1-9]\d{1,14}$/

export class SMSPayload implements SMSPayloadDataStructure {
  providerId: string
  origin: string
  destination: string
  submitTimestamp: number | undefined
  validityPeriod: number | undefined
  message: MessageDataStructure
  deliveryStatus: DeliveryStatusDataStructure | undefined

  constructor (smsPayload: SMSPayloadDataStructure) {
    this.providerId = smsPayload.providerId
    this.origin = smsPayload.origin
    this.destination = smsPayload.destination
    this.submitTimestamp = smsPayload.submitTimestamp
    this.validityPeriod = smsPayload.validityPeriod
    this.message = smsPayload.message
    this.deliveryStatus = smsPayload.deliveryStatus
  }

  public async validate (): Promise<boolean> {
    if (typeof this.providerId === 'undefined' || this.providerId.length === 0) {
      return false
    }
    if (typeof this.origin === 'undefined' || !ADDRESS_REGEX.test(this.origin)) {
      return false
    }
    if (typeof this.destination === 'undefined' || !ADDRESS_REGEX.test(this.destination)) {
      return false
    }
    if (typeof this.message.content === 'undefined' || this.message.content.length === 0) {
      return false
    }
    return true
  }
}
