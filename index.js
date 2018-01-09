var pathSep = require('path').sep;
var TEAMCITY_VERSION = 'TEAMCITY_VERSION';

function teamcityReporter(result) {
    if (TEAMCITY_VERSION in process.env) {
        result.testResults.forEach(it => logTestSuite(it));
        logCoverage(result.coverageMap);
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
    } else if (suite.failureMessage != null && suite.failureMessage.length > 0) {
        console.log("##teamcity[testStarted name='Generic test suite failure']");
        console.log("##teamcity[testFailed name='Generic test suite failure' message='FAILED' details='%s']", escape(suite.failureMessage));
        console.log("##teamcity[testFinished name='Generic test suite failure' duration='0']");
    }

    console.log("##teamcity[testSuiteFinished name='%s' duration='%s']", name, duration);
}

function logTestResult(suite, testResult) {
    const name = escape(testResult.fullName);
    const duration = testResult.duration;

    console.log("##teamcity[testStarted name='%s']", name);

    if (testResult.status === 'failed') {
        const details = testResult.failureMessages.length > 0
            ? testResult.failureMessages[0]
            : 'No details available';
        console.log("##teamcity[testFailed name='%s' message='FAILED' details='%s']", name, escape(details));
    }

    if (testResult.status === 'pending' || testResult.status === 'skipped') {
        console.log("##teamcity[testIgnored name='%s' message='%s']", name, testResult.status);
    }

    console.log("##teamcity[testFinished name='%s' duration='%s']", name, duration);
}

function logCoverage(coverageMap) {
    const coverageSummary = coverageMap.getCoverageSummary().data;
    const map = new Map([
        ['L', coverageSummary.lines],
        ['S', coverageSummary.statements],
        ['M', coverageSummary.functions],
        ['R', coverageSummary.branches]
    ]);
    map.forEach((metrics, abbreviation) => {
        console.log("##teamcity[buildStatisticValue key='%s' value='%s']", `CodeCoverageAbs${abbr}TotalJS`, metrics.total);
        console.log("##teamcity[buildStatisticValue key='%s' value='%s']", `CodeCoverageAbs${abbr}CoveredJS`, metrics.covered);
        console.log("##teamcity[buildStatisticValue key='%s' value='%s']", `CodeCoveragePercent${abbr}CoveredJS`, metrics.pct);
    });
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
