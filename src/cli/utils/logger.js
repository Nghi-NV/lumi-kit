const chalk = require('chalk');

/**
 * Logger utility for styled console output
 */
const logger = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✔'), msg),
  warning: (msg) => console.log(chalk.yellow('⚠'), msg),
  error: (msg) => console.log(chalk.red('✖'), msg),

  // Styled headers
  header: (msg) => {
    console.log();
    console.log(chalk.bold.cyan('━'.repeat(50)));
    console.log(chalk.bold.cyan(`  🚀 ${msg}`));
    console.log(chalk.bold.cyan('━'.repeat(50)));
    console.log();
  },

  // List output
  list: (items) => {
    items.forEach(item => {
      console.log(chalk.gray('  •'), item);
    });
  },

  // Command suggestion
  command: (cmd) => console.log(chalk.gray('  $'), chalk.white(cmd)),

  // Section divider
  divider: () => console.log(chalk.gray('─'.repeat(50)))
};

module.exports = { logger };
