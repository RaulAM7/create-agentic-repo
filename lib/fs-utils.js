const fs = require('node:fs');
const path = require('node:path');

function pathExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

function isDirectoryEmpty(dirPath) {
  return fs.readdirSync(dirPath).length === 0;
}

function copyDirectoryRecursive(srcDir, destDir, options) {
  const { dryRun, logger } = options;

  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  logger(`[copy] ${destDir}`);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath, options);
      continue;
    }

    if (entry.isFile()) {
      logger(`[copy] ${destPath}`);
      if (!dryRun) {
        fs.copyFileSync(srcPath, destPath);
        const srcMode = fs.statSync(srcPath).mode;
        fs.chmodSync(destPath, srcMode);
      }
    }
  }
}

function replacePlaceholdersInTextFiles(rootDir, replacements, options) {
  const { dryRun, logger } = options;
  const textExtensions = new Set(['.md', '.txt']);

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(filePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      if (!textExtensions.has(ext)) {
        continue;
      }

      const original = fs.readFileSync(filePath, 'utf8');
      let next = original;

      for (const [token, value] of Object.entries(replacements)) {
        next = next.split(token).join(value);
      }

      if (next !== original) {
        logger(`[replace] ${filePath}`);
        if (!dryRun) {
          fs.writeFileSync(filePath, next, 'utf8');
        }
      }
    }
  }

  walk(rootDir);
}

function ensureKeepFilesForEmptyDirs(rootDir, options) {
  const { dryRun, logger } = options;

  function visit(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        visit(path.join(currentDir, entry.name));
      }
    }

    const remaining = fs.readdirSync(currentDir);
    if (remaining.length === 0) {
      const keepPath = path.join(currentDir, '.keep');
      logger(`[keep] ${keepPath}`);
      if (!dryRun) {
        fs.writeFileSync(keepPath, '', 'utf8');
      }
    }
  }

  visit(rootDir);
}

module.exports = {
  copyDirectoryRecursive,
  ensureKeepFilesForEmptyDirs,
  isDirectoryEmpty,
  pathExists,
  replacePlaceholdersInTextFiles,
};
