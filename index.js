var pathSep = require('path').sep;
var TEAMCITY_VERSION = 'TEAMCITY_VERSION';

function teamcityReporter(result) {
    if (TEAMCITY_VERSION in process.env) {
        result.testResults.forEach(it => logTestSuite(it));
    }
    return result;
}

function logTestSuite(suite) {
    const split = suite.testFilePath.split(pathSep);
    const name = escape(split[split.length - 2] + '/' + split[split.length - 1]);
    const duration = suite.perfStats.end - suite.perfStats.start;
    const testResults = suite.testResults;

    console.log("##teamcity[testSuiteStarted name='%s']", name);

    if (testResults != null && testResults.length > 0) {
        testResults.forEach(it => logTestResult(suite, it));
    } else if (suite.failureMessage) {
        console.log("##teamcity[testStarted name='Execution Error']");
        console.log("##teamcity[testFailed name='Execution Error' message='FAILED' details='%s']", escape(suite.failureMessage));
        console.log("##teamcitytestFinished name='Execution Error' duration='0']");
    }

    console.log("##teamcity[testSuiteFinished name='%s' duration='%s']", name, duration);
}

function logTestResult(suite, testResult) {
    const name = escape(testResult.title);
    const duration = testResult.duration;

    console.log("##teamcity[testStarted name='%s']", name);

    if (testResult.status === 'failed') {
        const details = testResult.failureMessages.length > 0
            ? testResult.failureMessages[0]
            : 'No details available';
        console.log("##teamcity[testFailed name='%s' message='FAILED' details='%s']", name, escape(details));
    }

    console.log("##teamcity[testFinished name='%s' duration='%s']", name, duration);
}


function escape(message) {
    if (message === null || message === undefined) {
        return '';
    }

    return message.toString()
        .replace(/\|/g, '||')
        .replace(/'/g, "|'")
        .replace(/\n/g, '|n')
        .replace(/\r/g, '|r')
        .replace(/\u0085/g, '|x')
        .replace(/\u2028/g, '|l')
        .replace(/\u2029/g, '|p')
        .replace(/\[/g, '|[')
        .replace(/]/g, '|]');
}

module.exports = teamcityReporter;
