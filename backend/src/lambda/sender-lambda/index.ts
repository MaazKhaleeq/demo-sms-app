import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { SMSPayload, SMSPayloadDataStructure } from '../../models/sms-payload.model'

export const handler = async (smsPayloadDS: SMSPayloadDataStructure): Promise<void> => {
  const ddbTableName = process.env.DDB_TABLE_NAME
  if (ddbTableName === undefined) {
    throw new Error('DDB table name is undefined')
  }

  const smsPayload = new SMSPayload(smsPayloadDS)
  const validPayload = await smsPayload.validate()
  if (!validPayload) {
    throw new Error('Invalid SMS payload')
  }

  const dynamodbClient = new DynamoDBClient()
  await createSmsRecordInDDB(dynamodbClient, smsPayload, ddbTableName)
  dynamodbClient.destroy()
}

async function createSmsRecordInDDB (client: DynamoDBClient, payload: SMSPayload, ddbTableName: string): Promise<void> {
  const submitTimestamp = payload.submitTimestamp ?? Date.now()
  let expirationTimestamp = 0
  if (payload.validityPeriod !== undefined) {
    expirationTimestamp = submitTimestamp + payload.validityPeriod * 1000
  }
  const input: PutItemCommandInput = {
    TableName: ddbTableName,
    Item: {
      DestinationAddress: { S: payload.destination.toString() },
      ProviderId: { S: payload.providerId },
      OriginAddress: { S: payload.origin.toString() },
      Message: { S: payload.message.content },
      SubmitTimestamp: { N: submitTimestamp.toString() },
      ExpirationTimestamp: { N: expirationTimestamp.toString() }
    }
  }
  try {
    await client.send(new PutItemCommand(input))
  } catch (err) {
    throw new Error('Error inserting SMS record into DynamoDB table')
  }
}
