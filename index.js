var pathSep = require('path').sep;
var TEAMCITY_VERSION = 'TEAMCITY_VERSION';

const processPID = process.pid.toString();

const TEST_IGNORED = "##teamcity[testIgnored name='%s' message='%s' flowId='%s']";
const SUITE_START = "##teamcity[testSuiteStarted name='%s' flowId='%s']";
const SUITE_END = "##teamcity[testSuiteFinished name='%s' duration='%s' flowId='%s']";

const TEST_START = "##teamcity[testStarted name='%s' flowId='%s']";
const TEST_FAILED = "##teamcity[testFailed name='%s' message='FAILED' details='%s' flowId='%s']";
const TEST_END = "##teamcity[testFinished name='%s' duration='%s' flowId='%s']";

const BUILD_STATISTIC_VALUE = "##teamcity[buildStatisticValue key='%s' value='%s']";

function teamcityReporter(result) {
    if (TEAMCITY_VERSION in process.env) {
        var flowId = process.env['JEST_TEAMCITY_FLOWID'] || processPID;
        result.testResults.forEach(it => logTestSuite(it, flowId));
        if (result.coverageMap != null) {
            logCoverage(result.coverageMap);
        }
    }
    return result;
}

function logTestSuite(suite, flowId) {
    const split = suite.testFilePath.split(pathSep);
    const name = escape(split[split.length - 2] + '/' + split[split.length - 1]);
    const duration = suite.perfStats.end - suite.perfStats.start;
    const testResults = suite.testResults;

    console.log(SUITE_START, name, flowId);

    if (testResults != null && testResults.length > 0) {
        testResults.forEach(it => logTestResult(suite, it, flowId));
    } else if (suite.failureMessage != null && suite.failureMessage.length > 0) {
        console.log(TEST_START, 'Generic test suite failure', flowId);
        console.log(TEST_FAILED, 'Generic test suite failure', escape(suite.failureMessage), flowId);
        console.log(TEST_END, 'Generic test suite failure', '0', flowId);
    }

    console.log(SUITE_END, name, duration, flowId);
}

function logTestResult(suite, testResult, flowId) {
    const name = escape(testResult.fullName);
    const duration = testResult.duration;

    console.log(TEST_START, name, flowId);

    if (testResult.status === 'failed') {
        const details = testResult.failureMessages.length > 0
            ? testResult.failureMessages[0]
            : 'No details available';
        console.log(TEST_FAILED, name, escape(details), flowId);
    }

    if (testResult.status === 'pending' || testResult.status === 'skipped') {
        console.log(TEST_IGNORED, name, testResult.status, flowId);
    }

    console.log(TEST_END, name, duration, flowId);
}

function logCoverage(coverageMap) {
    if (typeof coverageMap.getCoverageSummary === 'function') {
        const coverageSummary = coverageMap.getCoverageSummary().data;
        const map = new Map([
            ['Lines', coverageSummary.lines],
            ['Statements', coverageSummary.statements],
            ['Functions', coverageSummary.functions],
            ['Branches', coverageSummary.branches]
        ]);
        map.forEach((metrics, key) => {
            const tcKeyDict = {
                'Lines': 'L',
                'Functions': 'M',
                'Branches': 'R',
                'Statements': 'S'
            };
            
            console.log(BUILD_STATISTIC_VALUE, `Total Number of JS ${key}`, metrics.total);
            console.log(BUILD_STATISTIC_VALUE, `Covered Number of JS ${key}`, metrics.covered);
            console.log(BUILD_STATISTIC_VALUE, `Covered Percentage of JS ${key}`, metrics.pct);
            
            if(tcKeyDict[key]) {
                const tcKey = tcKeyDict[key];
                console.log(BUILD_STATISTIC_VALUE, `CodeCoverageAbs${tcKey}Total`, metrics.total);
                console.log(BUILD_STATISTIC_VALUE, `CodeCoverageAbs${tcKey}Covered`, metrics.covered);
            }
        });
    }
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
