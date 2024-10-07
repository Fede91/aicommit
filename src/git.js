const simpleGit = require("simple-git");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const git = simpleGit();

async function stageChanges(verbose) {
  if (verbose) {
    const { stdout, stderr } = await exec("git add .");
    console.log(stdout);
    if (stderr) console.error(stderr);
  } else {
    await git.add(".");
  }
}

async function getStatus() {
  return await git.status();
}

async function getDiff() {
  return await git.diff(["--cached"]);
}

async function commitChanges(message, verbose) {
  if (verbose) {
    const { stdout, stderr } = await exec(
      `git commit -m "${message.replace(/"/g, '\\"')}"`
    );
    console.log(stdout);
    if (stderr) console.error(stderr);
  } else {
    await git.commit(message);
  }
}

async function pushChanges(branchName, verbose) {
  if (verbose) {
    const { stdout, stderr } = await exec(`git push origin ${branchName}`);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } else {
    await git.push("origin", branchName);
  }
}

module.exports = {
  stageChanges,
  getStatus,
  getDiff,
  commitChanges,
  pushChanges,
};
