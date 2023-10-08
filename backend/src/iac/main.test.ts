import { DemoSmsApp } from './app/demo-sms-app'

describe('DemoSmsApp', () => {
  let app: DemoSmsApp

  beforeEach(() => {
    app = new DemoSmsApp()
  })

  it('should create an instance of DemoSmsApp', () => {
    expect(app).toBeInstanceOf(DemoSmsApp)
  })

  it('should call the synth method', () => {
    const synthSpy = jest.spyOn(app, 'synth')
    app.synth()
    expect(synthSpy).toHaveBeenCalled()
  })
})
