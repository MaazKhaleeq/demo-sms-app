import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { DemoSmsStack } from './demo-sms-stack'

describe('Stack created with expected resources', () => {
  let template: Template

  beforeAll(() => {
    const app = new cdk.App()
    const stack = new DemoSmsStack(app, 'DemoSmsStack', {
      stackName: 'DemoSmsTestStack'
    })
    template = Template.fromStack(stack)
  })

  test('Verify resource count', () => {
    // Assert
    // 1 DynamoDB Table
    template.resourceCountIs('AWS::DynamoDB::Table', 1)
    // 1 AWS Lambda, 1 Generated LogRetention Lambda
    template.resourceCountIs('AWS::Lambda::Function', 2)
    // 1 IAM Policy for Sender Lambda, 1 IAM Policy for LogRetention Lambda
    template.resourceCountIs('AWS::IAM::Policy', 2)
  })

  test('Verify DynamoDB Table', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: 'Message-Data',
      KeySchema: [
        {
          AttributeName: 'DestinationAddress',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'SubmitTimestamp',
          KeyType: 'RANGE'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      TimeToLiveSpecification: {
        AttributeName: 'ExpirationTimestamp',
        Enabled: true
      }
    })
  })
})
