import { DemoSmsStack } from '../stack/demo-sms-stack'
import { DemoSmsApp } from './demo-sms-app'
import * as cdk from 'aws-cdk-lib'

jest.mock('aws-cdk-lib')
jest.mock('aws-cdk-lib/aws-dynamodb')
jest.mock('aws-cdk-lib/aws-lambda-nodejs')
jest.mock('aws-cdk-lib/aws-iam')

describe('DemoSmsApp', () => {
  let app: DemoSmsApp

  beforeEach(() => {
    app = new DemoSmsApp()
  })

  test('Should create a new DemoSmsApp instance', () => {
    expect(app).toBeInstanceOf(DemoSmsApp)
  })

  test('Should call the super constructor with props', () => {
    expect(cdk.App).toBeCalledWith(undefined)
  })

  test('Should create a new DemoSmsStack', () => {
    expect(DemoSmsStack).toBeCalledWith(expect.any(DemoSmsApp), 'DemoSmsStack', {
      stackName: 'DemoSmsStack'
    })
  })
})
