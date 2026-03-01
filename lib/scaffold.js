const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  copyDirectoryRecursive,
  ensureKeepFilesForEmptyDirs,
  isDirectoryEmpty,
  pathExists,
  replacePlaceholdersInTextFiles,
} = require('./fs-utils');

function scaffoldProject(options) {
  const {
    projectName,
    targetDir,
    template,
    dryRun,
    noGit,
    logger,
  } = options;

  const templateDir = path.resolve(__dirname, '..', 'templates', template);
  if (!pathExists(templateDir)) {
    throw new Error(`Unknown template: ${template}`);
  }

  if (pathExists(targetDir) && !isDirectoryEmpty(targetDir)) {
    throw new Error(`Target directory already exists and is not empty: ${targetDir}`);
  }

  logger(`[info] template=${template}`);
  logger(`[info] project=${projectName}`);
  logger(`[info] target=${targetDir}`);

  copyDirectoryRecursive(templateDir, targetDir, { dryRun, logger });

  if (dryRun) {
    logger('[dry-run] placeholder replacement skipped (no files written)');
    logger('[dry-run] empty-dir .keep check skipped (no files written)');
  } else {
    replacePlaceholdersInTextFiles(
      targetDir,
      { '{{PROJECT_NAME}}': projectName },
      { dryRun, logger }
    );

    ensureKeepFilesForEmptyDirs(targetDir, { dryRun, logger });
  }

  if (!noGit) {
    if (dryRun) {
      logger(`[git] would run: git init (${targetDir})`);
    } else {
      const result = spawnSync('git', ['init'], {
        cwd: targetDir,
        stdio: 'ignore',
      });

      if (result.status !== 0) {
        logger('[warn] git init failed; continue manually if needed.');
      } else {
        logger('[git] initialized repository');
      }
    }
  }
}

module.exports = {
  scaffoldProject,
};
