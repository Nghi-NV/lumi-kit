const { Command } = require('commander');
const { initCommand } = require('./commands/init');
const { checkCommand } = require('./commands/check');
const { logger } = require('./utils/logger');
const pkg = require('../../package.json');

/**
 * Lumi-Kit CLI
 * 
 * AI-driven development toolkit with multi-platform support
 */
const program = new Command();

program
  .name('lumi-kit')
  .description('AI-driven development toolkit with multi-platform support')
  .version(pkg.version);

// Init command
program
  .command('init [path]')
  .description('Initialize lumi-kit in a project')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--platform <platform>', 'Specify AI platform (claude|cursor|antigravity|codex|gemini)')
  .option('--all', 'Install all platforms at once')
  .action(initCommand);

// Check command
program
  .command('check')
  .description('Check system requirements')
  .action(checkCommand);

// Error handling
program.on('command:*', () => {
  logger.error(`Invalid command: ${program.args.join(' ')}`);
  console.log('');
  console.log('Available commands:');
  console.log('  init [path]   Initialize lumi-kit in a project');
  console.log('  check         Check system requirements');
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
