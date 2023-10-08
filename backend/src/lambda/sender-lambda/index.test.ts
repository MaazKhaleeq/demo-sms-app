import { handler } from './index'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { SMSPayloadDataStructure } from '../../models/sms-payload.model'

jest.mock('@aws-sdk/client-dynamodb')

describe('sender-lambda', () => {
  let putItemSpy: jest.SpyInstance

  beforeEach(() => {
    process.env.DDB_TABLE_NAME = 'test-table'
    putItemSpy = jest.spyOn(DynamoDBClient.prototype, 'send')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should throw error when DDB table name is undefined', async () => {
    delete process.env.DDB_TABLE_NAME
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    await expect(handler(payload)).rejects.toThrow('DDB table name is undefined')
  })

  it('should throw error when payload is invalid - content', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: '',
        length: 0
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    await expect(handler(payload)).rejects.toThrow('Invalid SMS payload')
  })

  it('should throw error when payload is invalid - provider', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'test message',
        length: 0
      },
      providerId: '',
      validityPeriod: 60
    }

    await expect(handler(payload)).rejects.toThrow('Invalid SMS payload')
  })

  it('should throw error when payload is invalid - origin', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+1234567890',
      origin: '987654321',
      message: {
        content: 'test message',
        length: 0
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    await expect(handler(payload)).rejects.toThrow('Invalid SMS payload')
  })

  it('should throw error when payload is invalid - destination', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '',
      origin: '+98769876987654',
      message: {
        content: 'test message',
        length: 0
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    await expect(handler(payload)).rejects.toThrow('Invalid SMS payload')
  })

  it('should throw error when inserting SMS record into DynamoDB table fails', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementation(() => {
      throw new Error('Error inserting SMS record into DynamoDB table')
    })

    await expect(handler(payload)).rejects.toThrow('Error inserting SMS record into DynamoDB table')
  })

  it('should insert SMS record into DynamoDB table', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: 'test-provider',
      validityPeriod: 60
    }

    await handler(payload)

    expect(putItemSpy).toHaveBeenCalledWith(expect.any(PutItemCommand))
  })

  it('should insert SMS record into DynamoDB table', async () => {
    const payload: SMSPayloadDataStructure = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: 'test-provider',
      validityPeriod: 60,
      submitTimestamp: Date.now()
    }

    await handler(payload)

    expect(putItemSpy).toHaveBeenCalledWith(expect.any(PutItemCommand))
  })
})
