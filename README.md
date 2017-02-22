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

The reporter is only active when the environment variable `TEAMCITY_VERSION` is present which should be the case for most common Teamcity server installations. So on your local machine the reporter should be disabled by default. You can test the reporter by temporarily setting the environment variable:

`export TEAMCITY_VERSION="your_version"`

Then, just use Jest as usual, e.g. put this in your `package.json`

```
"scripts": {
    "test": "jest"
}
```

Then, simply run `npm test` locally and from Teamcity.

### License

MIT © [Benjamin Winterberg](https://twitter.com/winterbe_)
