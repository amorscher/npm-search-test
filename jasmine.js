const Jasmine = require('jasmine');
const jasmineReporters = require('jasmine-reporters');
const jasmine = new Jasmine();

function isUnitTestRun() {
    return process.argv.some(arg => arg === 'unit')
}

function isE2ETestRun() {
    return process.argv.some(arg => arg === 'e2e')
}

let specFiles = [];
let reportSuffix = '';

if (isUnitTestRun()) {
    specFiles = ['./src/**/*spec.ts', '!./src/**/*integration.spec.ts'];
    reportSuffix = '_unit';
} else if (isE2ETestRun()) {
    specFiles = ['./src/**/*integration.spec.ts'];
    reportSuffix = '_e2e';
} else {
    specFiles = ['./src/**/*spec.ts'];
}

jasmine.loadConfig({
    spec_files: specFiles,
    helpers: ['helpers/**/*.js'],
    random: false,
    seed: null,
    stopSpecOnExpectationFailure: false
});
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

// setup console reporter
var junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: 'test-results',

    filePrefix: 'test-results'+reportSuffix,
    consolidateAll: true
});
jasmine.addReporter(junitReporter);
// initialize and execute
jasmine.execute();