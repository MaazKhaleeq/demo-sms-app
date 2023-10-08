import { DemoSmsApp } from './app/demo-sms-app'

export default (async () => {
  const app = new DemoSmsApp()
  app.synth()
})().catch(err => {
  /* eslint-disable no-console */
  console.error(err)
  process.exit(1)
})
