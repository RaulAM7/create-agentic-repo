const path = require('node:path');
const { scaffoldProject } = require('./scaffold');

function printHelp() {
  console.log('create-agentic-repo');
  console.log('');
  console.log('Usage:');
  console.log('  create-agentic-repo <name> [options]');
  console.log('  create-agentic-repo .        Scaffold into current directory');
  console.log('');
  console.log('Options:');
  console.log('  --template <name>   Template to use (default: minimal)');
  console.log('  --yes               Non-interactive mode');
  console.log('  --no-git            Skip git init in generated project');
  console.log('  --dry-run           Show actions without creating files');
  console.log('  -h, --help          Show help');
}

function parseArgs(argv) {
  let name;
  let template = 'minimal';
  let yes = false;
  let noGit = false;
  let dryRun = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      return { help: true };
    }

    if (arg === '--yes') {
      yes = true;
      continue;
    }

    if (arg === '--no-git') {
      noGit = true;
      continue;
    }

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--template') {
      template = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg.startsWith('--template=')) {
      template = arg.slice('--template='.length);
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (!name) {
      name = arg === '.' ? '.' : arg;
      continue;
    }

    throw new Error(`Unexpected argument: ${arg}`);
  }

  if (!name && yes) {
    name = 'agentic-repo';
  }

  if (!name) {
    throw new Error('Project name is required (or pass --yes to use default name).');
  }

  if (template !== 'minimal') {
    throw new Error(`Unsupported template: ${template}. Only "minimal" is available.`);
  }

  return {
    dryRun,
    help: false,
    name,
    noGit,
    template,
    yes,
  };
}

function printNextSteps(projectName) {
  console.log('');
  console.log('Next steps:');
  console.log(`1) cd ${projectName}`);
  console.log('2) Drop your raw context into 00_inbox/');
  console.log('3) Run Distill using 01_harness/TASKFLOW.md');
}

function main() {
  try {
    const parsed = parseArgs(process.argv.slice(2));
    if (parsed.help) {
      printHelp();
      return;
    }

    const isInPlace = parsed.name === '.';
    const targetDir = isInPlace
      ? process.cwd()
      : path.resolve(process.cwd(), parsed.name);
    const projectName = isInPlace
      ? path.basename(targetDir)
      : parsed.name;
    const logger = (line) => console.log(line);

    scaffoldProject({
      dryRun: parsed.dryRun,
      logger,
      noGit: parsed.noGit,
      projectName,
      targetDir,
      template: parsed.template,
    });

    if (parsed.dryRun) {
      console.log('');
      console.log('Dry run complete. No files were written.');
      return;
    }

    console.log('');
    console.log(`Created ${projectName}.`);
    if (!isInPlace) {
      printNextSteps(projectName);
    } else {
      console.log('');
      console.log('Next steps:');
      console.log('1) Drop your raw context into 00_inbox/');
      console.log('2) Run Distill using 01_harness/TASKFLOW.md');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  main,
  parseArgs,
};
