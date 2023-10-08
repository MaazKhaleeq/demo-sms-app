# Demo SMS App

## Guidance
* Check quality with `npm run analyze`, `npm run test` and after deployment `npm run integration-test`
* Build with `npm run build`
* Deploy with `npm run deploy`
* Install dependencies with `npm run install-all`
* Dependencies are to be placed in the applicable module, and as we bundle for release, should be dev dependencies (`npm install --save-dev`)

## Deployment
The command `npm run deploy` will trigger the publishing mechanism. In the backend workspace, it means the execution of the `cdk`
framework, that requires the definition of the following environment variable:

- `AWS_PROFILE` - the profile (Access Key ID, Secret Access Key, and default Region) for the deployment. Articles can
  be easily found on Amazon
  [in this regard](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

## Integration tests
For executing integration tests against an AWS stack from your local environment:
1. Configure AWS_PROFILE environment variable with the profile name used for deployment
2. Deploy your stack using `npm run deploy`
3. Execute the tests using `npm run integration-test`
