/* eslint-disable no-new -- CDK */
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

export class DemoSmsStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    // DYNAMODB
    const ddbTable = new dynamodb.Table(this, 'Message-Data', {
      tableName: 'Message-Data',
      partitionKey: {
        name: 'DestinationAddress',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'SubmitTimestamp',
        type: dynamodb.AttributeType.NUMBER
      },
      timeToLiveAttribute: 'ExpirationTimestamp'
    })

    const senderLambda = new NodejsFunction(this, 'senderLambda', {
      description: 'Sender Lambda',
      functionName: 'SenderLambda',
      runtime: lambda.Runtime.NODEJS_16_X,
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(30),
      entry: 'src/lambda/sender-lambda/index.ts',
      handler: 'handler',
      environment: {
        DDB_TABLE_NAME: ddbTable.tableName
      },
      logRetention: RetentionDays.ONE_DAY
    })

    const senderLambdaPolicy = new Policy(this, 'SenderLambdaPolicy', {
      statements: [
        new PolicyStatement({
          actions: [
            'dynamodb:PutItem',
            'dynamodb:Query'
          ],
          resources: [ddbTable.tableArn]
        })
      ]
    })
    senderLambda.role?.attachInlinePolicy(senderLambdaPolicy)

    new cdk.CfnOutput(this, 'DdbTableName', {
      value: ddbTable.tableName,
      description: 'DynamoDB table name'
    })

    new cdk.CfnOutput(this, 'SenderFunctionName', {
      value: senderLambda.functionName,
      description: 'Sender Lambda function name'
    })
  }
}
