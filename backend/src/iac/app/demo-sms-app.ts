/* eslint-disable no-new -- CDK */
import * as cdk from 'aws-cdk-lib'
import { DemoSmsStack } from '../stack/demo-sms-stack'

export class DemoSmsApp extends cdk.App {
  constructor (props?: cdk.AppProps) {
    super(props)

    new DemoSmsStack(this, 'DemoSmsStack', {
      stackName: 'DemoSmsStack'
    })
  }
}
