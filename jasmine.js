const Jasmine = require('jasmine');
const jasmineReporters = require('jasmine-reporters');
const jasmine = new Jasmine();
jasmine.loadConfig({
    spec_files: ['./src/**/*spec.ts'],
    helpers: ['helpers/**/*.js'],
    random: false,
    seed: null,
    stopSpecOnExpectationFailure: false
});
jasmine.jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
 
// setup console reporter
var junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: 'test-results',
   
    filePrefix: 'test-results',
    consolidateAll: true
});
jasmine.addReporter(junitReporter);
// initialize and execute
jasmine.execute();