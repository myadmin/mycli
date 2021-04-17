const which = require('which');

function runCmd(cmd, args, fn) {
  args = args || [];
  let runner = require('child_process').spawn(cmd, args, {
    stdio: 'inherit',
  });
  runner.on('close', (code) => {
    if (fn) {
      fn(code);
    }
  });
}

function findNpm() {
  let npms = process.platform === 'win32' ? ['npm.cmd'] : ['npm'];
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      // console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {
      console.error('error', e);
    }
  }
  throw new Error('please install npm');
}

module.exports = function (installArg = ['install']) {
  const npm = findNpm();
  return function (done) {
    runCmd(which.sync(npm), installArg, function () {
      done && done();
    });
  };
};
