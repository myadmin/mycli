const program = require('commander');
const { blue, green } = require('./src/commander-nodejs');

program.version('0.0.1').parse(process.argv);

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size');

program.parse(process.argv);

if (program.debug) {
  blue('option is debug');
} else {
  blue('option is small');
}
