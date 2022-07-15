const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  const command = `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.exe`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  executeCpp,
};
