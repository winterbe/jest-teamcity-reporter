# jest-teamcity-reporter

> Integrate Jest test results into your Teamcity CI builds

![screenshot1](https://raw.githubusercontent.com/winterbe/jest-teamcity-reporter/master/docs/screenshot1.png)

![screenshot2](https://raw.githubusercontent.com/winterbe/jest-teamcity-reporter/master/docs/screenshot2.png)

![screenshot3](https://raw.githubusercontent.com/winterbe/jest-teamcity-reporter/master/docs/screenshot3.png)

![screenshot4](https://raw.githubusercontent.com/winterbe/jest-teamcity-reporter/master/docs/screenshot4.png)

This package will report your JavaScript Jest test results to your Teamcity CI server, so you can see the number of executed tests, test failures and the tests tab right from your Teamcity UI.

<p align="center">
   <i>Follow on <a href="https://twitter.com/winterbe_">Twitter</a> for Updates</i>
</p>

### Usage

First, install the package from NPM: `npm install --save-dev jest-teamcity-reporter`

The reporter integrates with Jest in form of a [testResultsProcessor](https://facebook.github.io/jest/docs/api.html#testresultsprocessor-string). Put this into your projects `package.json`:

```
"jest": {
    "testResultsProcessor": "jest-teamcity-reporter"
}
```

Since you only want the reporter to work on your Teamcity server and not locally, pass the following option when running Jest from Teamcity:

`jest --teamcity`

E.g. you can add those scripts to your projects `package.json`:

```
"scripts": {
    "test": "jest",
    "test:teamcity": "jest --teamcity"
}
```

Then, in Teamcity create a new Command Line Build Step and run the following command:

`npm run test:teamcity`

> Use the command `npm test` on your local machine and Teamcity reporting will be skipped.

As of version 0.3.0 the evironment variable `TEAMCITY_VERSION` can be used as an replacement for the `--teamcity` flag. You can skip the flag as long as the environment variable is set.

### License

MIT © [Benjamin Winterberg](https://twitter.com/winterbe_)
