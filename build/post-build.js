const fs = require("fs");
const path = require("path");
const proc = require("child_process");

function executeCommand(command) {
  return proc.execSync(command).toString().trim();
}

const commit = {
  sha: executeCommand("git rev-parse HEAD"),
  message: executeCommand("git log -1 --pretty=%B"),
  author: executeCommand("git log -1 --pretty=format:%an")
};

const json = JSON.stringify(commit);

fs.writeFileSync(path.resolve(__dirname, "../dist/commit.json"), json);

// GitHub Pages serves fixed bundle names, so browsers can keep an older broken UI bundle cached.
// Append the current commit hash to generated JS URLs so every deploy forces fresh runtime code.
const indexPath = path.resolve(__dirname, "../dist/index.html");
const cacheKey = commit.sha.slice(0, 12);
const indexHtml = fs.readFileSync(indexPath, "utf8")
  .replace(/js\/chunk-vendors\.js(?:\?v=[^"']*)?/gu, `js/chunk-vendors.js?v=${cacheKey}`)
  .replace(/js\/app\.js(?:\?v=[^"']*)?/gu, `js/app.js?v=${cacheKey}`);
fs.writeFileSync(indexPath, indexHtml);
