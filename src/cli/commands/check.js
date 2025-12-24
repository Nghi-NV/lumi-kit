const { logger } = require('../utils/logger');

/**
 * Check command - verify system requirements
 */
async function checkCommand() {
  logger.header('System Check');

  const checks = [
    { name: 'Node.js version', check: checkNodeVersion },
    { name: 'npm available', check: checkNpm },
    { name: 'Git available', check: checkGit }
  ];

  let allPassed = true;

  for (const { name, check } of checks) {
    try {
      const result = await check();
      if (result.success) {
        logger.success(`${name}: ${result.message}`);
      } else {
        logger.warning(`${name}: ${result.message}`);
        allPassed = false;
      }
    } catch (error) {
      logger.error(`${name}: ${error.message}`);
      allPassed = false;
    }
  }

  console.log();
  if (allPassed) {
    logger.success('All checks passed! Ready to use lumi-kit.');
  } else {
    logger.warning('Some checks failed. Please address the issues above.');
  }
}

function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0], 10);

  if (major >= 18) {
    return { success: true, message: version };
  }
  return { success: false, message: `${version} (requires >= 18)` };
}

function checkNpm() {
  try {
    const { execSync } = require('child_process');
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim();
    return { success: true, message: `v${version}` };
  } catch {
    return { success: false, message: 'Not found' };
  }
}

function checkGit() {
  try {
    const { execSync } = require('child_process');
    const version = execSync('git --version', { encoding: 'utf-8' }).trim();
    return { success: true, message: version };
  } catch {
    return { success: false, message: 'Not found' };
  }
}

module.exports = { checkCommand };
