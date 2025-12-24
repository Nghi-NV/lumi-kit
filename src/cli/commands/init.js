const path = require('path');
const { logger } = require('../utils/logger');
const { files } = require('../utils/files');
const { promptPlatform, promptAgents, confirmInit, PLATFORMS } = require('../utils/prompts');
const { Installer } = require('../../core/installer');

/**
 * Init command - initialize lumi-kit in a project
 * 
 * Usage:
 *   lumi-kit init .
 *   lumi-kit init <project-name>
 *   lumi-kit init . --platform claude
 *   lumi-kit init . --all          # Install all platforms
 */
async function initCommand(targetPath, options) {
  try {
    // Resolve target directory
    const targetDir = path.resolve(process.cwd(), targetPath || '.');

    logger.header('Lumi-Kit Initialization');
    console.log(`  Target: ${targetDir}\n`);

    // Check if directory exists or create it
    if (targetPath && targetPath !== '.') {
      await files.ensureDir(targetDir);
    }

    // Skip confirmation if --yes flag
    if (!options.yes) {
      const confirmed = await confirmInit(targetDir);
      if (!confirmed) {
        logger.warning('Initialization cancelled.');
        return;
      }
    }

    // Select agents to install first (same for all platforms)
    const agents = await promptAgents();

    if (agents.length === 0) {
      logger.warning('No agents selected. At least one agent is required.');
      return;
    }

    // Handle --all flag: install all platforms
    if (options.all) {
      console.log();
      logger.info('Installing ALL platforms...');
      console.log();

      const platformKeys = Object.keys(PLATFORMS);
      for (const platformKey of platformKeys) {
        const platformConfig = PLATFORMS[platformKey];
        console.log();
        logger.info(`📦 Installing ${platformConfig.name}...`);

        const installer = new Installer(targetDir, platformKey, platformConfig);
        await installer.installAgents(agents);
      }

      // Install shared resources once
      console.log();
      const firstInstaller = new Installer(targetDir, 'all', PLATFORMS.claude);
      firstInstaller.selectedAgents = agents;
      await firstInstaller.installSharedResources();

      // Update config.json with all platforms
      const configPath = path.join(targetDir, '.lumi-agent', 'config.json');
      await files.writeFile(configPath, JSON.stringify({
        version: '1.0.0',
        platforms: platformKeys,
        agents: agents,
        createdAt: new Date().toISOString()
      }, null, 2));

      // Success message for all platforms
      console.log();
      logger.divider();
      console.log();
      logger.success('🎉 Lumi-Kit initialized with ALL platforms!');
      console.log();
      console.log('  Created folders:');
      platformKeys.forEach(key => {
        console.log(`    • ${PLATFORMS[key].commandsDir}/`);
      });
      console.log();
      console.log('  Available agents:');
      agents.forEach(agent => {
        console.log(`    • /lumi-agent-${agent}`);
      });
      console.log();
      console.log('  Shared resources:');
      console.log('    • .lumi-agent/templates/');
      console.log('    • .lumi-agent/prompts/');
      console.log();
      logger.divider();
      return;
    }

    // Single platform mode
    let platform, config;
    if (options.platform && PLATFORMS[options.platform]) {
      platform = options.platform;
      config = PLATFORMS[platform];
      logger.info(`Using platform: ${config.name}`);
    } else if (options.platform) {
      logger.error(`Unknown platform: ${options.platform}`);
      logger.info('Available: claude, cursor, antigravity, codex, gemini');
      return;
    } else {
      const result = await promptPlatform();
      platform = result.platform;
      config = result.config;
    }
    console.log();
    logger.info(`Selected: ${config.name}`);

    console.log();
    logger.info(`Installing ${agents.length} agent(s)...`);
    console.log();

    // Initialize installer
    const installer = new Installer(targetDir, platform, config);

    // Install agents
    await installer.installAgents(agents);
    console.log();

    // Install shared resources
    await installer.installSharedResources();
    console.log();

    // Success message
    logger.divider();
    console.log();
    logger.success('🎉 Lumi-Kit initialized successfully!');
    console.log();
    console.log('  Available agents:');
    agents.forEach(agent => {
      console.log(`    • /lumi-agent-${agent}`);
    });
    console.log();
    console.log('  Shared resources:');
    console.log('    • .lumi-agent/templates/');
    console.log('    • .lumi-agent/prompts/');
    console.log();
    logger.divider();

  } catch (error) {
    logger.error(`Initialization failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { initCommand };

