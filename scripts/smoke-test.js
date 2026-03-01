const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runCli(args, cwd) {
  const cliPath = path.resolve(__dirname, '..', 'bin', 'create-agentic-repo.js');
  const result = spawnSync('node', [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  });

  return result;
}

function expectPath(base, relPath) {
  const full = path.join(base, relPath);
  assert(fs.existsSync(full), `Missing expected path: ${relPath}`);
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'create-agentic-repo-'));

  const result = runCli(['demo', '--template', 'minimal', '--yes', '--no-git'], tempRoot);
  assert(result.status === 0, `CLI failed: ${result.stderr || result.stdout}`);

  const projectDir = path.join(tempRoot, 'demo');

  expectPath(projectDir, '01_harness/RULES.md');
  expectPath(projectDir, '01_harness/TASKFLOW.md');
  expectPath(projectDir, 'shared/skills/distill-context/SKILL.md');
  expectPath(projectDir, 'shared/agents/distiller/AGENT.md');
  expectPath(projectDir, 'shared/skills/skill-creator/SKILL.md');
  expectPath(projectDir, 'shared/skills/skill-creator/scripts/run_loop.py');

  const readme = fs.readFileSync(path.join(projectDir, 'README.md'), 'utf8');
  assert(readme.includes('demo'), 'README does not include project name replacement.');
  assert(!readme.includes('{{PROJECT_NAME}}'), 'README still contains placeholder token.');

  const dryRunResult = runCli(['dryrun-demo', '--template', 'minimal', '--yes', '--dry-run'], tempRoot);
  assert(dryRunResult.status === 0, `Dry-run failed: ${dryRunResult.stderr || dryRunResult.stdout}`);
  assert(!fs.existsSync(path.join(tempRoot, 'dryrun-demo')), 'Dry-run should not create directory.');

  console.log('Smoke test passed.');
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
