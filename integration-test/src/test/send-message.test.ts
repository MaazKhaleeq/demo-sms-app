import { DemoSmsStack } from '@app/backend/cdk-output.json'
import { InvocationType, InvokeCommand, InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda'
import { DynamoDBClient, QueryCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb'
import { Payload } from '../models/payload.model'

describe('test Sender Lambda', () => {
  jest.setTimeout(30000)

  const functionName = DemoSmsStack.SenderFunctionName
  const tableName = DemoSmsStack.DdbTableName
  const lambdaClient = new LambdaClient({})
  const dynamodbClient = new DynamoDBClient({})

  it('should invoke lambda successfully', async () => {
    const payload = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: 'test-provider',
      submitTimestamp: Date.now(),
      validityPeriod: 60
    }

    const response = await invokeLambda(payload)
    expect(response.StatusCode).toBe(200)

    const queryResponse = await queryDynamoDb(payload.destination, payload.submitTimestamp)
    expect(queryResponse.Items).toHaveLength(1)
  })

  it('should fail with invalid payload', async () => {
    const payload = {
      destination: '+12341234123456',
      origin: '+98769876987654',
      message: {
        content: 'Test message',
        length: 12
      },
      providerId: '',
      submitTimestamp: Date.now(),
      validityPeriod: 60
    }

    const response = await invokeLambda(payload)
    expect(response.StatusCode).toBe(400)
  })

  /**
   * Method to invoke Lambda.
   * @param event payload for the Lambda.
   */
  const invokeLambda = async (event: Payload): Promise<InvokeCommandOutput> => {
    const command = new InvokeCommand({
      FunctionName: functionName,
      InvocationType: InvocationType.RequestResponse,
      Payload: Buffer.from(JSON.stringify(event))
    })

    return await lambdaClient.send(command)
  }

  const queryDynamoDb = async (destinationAddress: string, submitTimestamp: number): Promise<QueryCommandOutput> => {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: '#PK = :destination AND #SK = :submitTS',
      ExpressionAttributeNames: {
        '#PK': 'DestinationAddress',
        '#SK': 'SubmitTimestamp'
      },
      ExpressionAttributeValues: {
        ':destination': { S: destinationAddress },
        ':submitTS': { N: submitTimestamp.toString() }
      }
    })

    return await dynamodbClient.send(command)
  }
})
