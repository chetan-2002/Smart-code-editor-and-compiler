const { exec } = require("child_process");

const executeJs = (filepath) => {
  const command = `node ${filepath}`;
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  executeJs,
};
