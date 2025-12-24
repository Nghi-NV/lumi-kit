const inquirer = require('inquirer');

/**
 * AI platforms configuration
 */
const PLATFORMS = {
  claude: {
    name: 'Claude Code',
    configDir: '.claude',
    commandsDir: '.claude/commands',
    extension: '.md'
  },
  cursor: {
    name: 'Cursor',
    configDir: '.cursor',
    commandsDir: '.cursor/rules',
    extension: '.mdc'
  },
  antigravity: {
    name: 'Antigravity (Google DeepMind)',
    configDir: '.agent',
    commandsDir: '.agent/skills',
    extension: '.md'
  },
  codex: {
    name: 'Codex (OpenAI)',
    configDir: '.codex',
    commandsDir: '.codex/commands',
    extension: '.md'
  },
  gemini: {
    name: 'Gemini CLI',
    configDir: '.gemini',
    commandsDir: '.gemini/commands',
    extension: '.md'
  }
};

/**
 * Available agents
 */
const AGENTS = [
  {
    name: 'lumi-agent-docs',
    description: 'Documentation generator',
    value: 'docs'
  },
  {
    name: 'lumi-agent-git',
    description: 'Git workflow helper',
    value: 'git'
  },
  {
    name: 'lumi-agent-review',
    description: 'Code review assistant',
    value: 'review'
  }
];

/**
 * Prompt user to select AI platform
 */
async function promptPlatform() {
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Select your AI platform:',
      choices: Object.entries(PLATFORMS).map(([key, value]) => ({
        name: value.name,
        value: key
      }))
    }
  ]);

  return { platform, config: PLATFORMS[platform] };
}

/**
 * Prompt user to select agents to install
 */
async function promptAgents() {
  const { agents } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'agents',
      message: 'Select agents to install:',
      choices: AGENTS.map(agent => ({
        name: `${agent.name} - ${agent.description}`,
        value: agent.value,
        checked: true
      }))
    }
  ]);

  return agents;
}

/**
 * Confirm initialization
 */
async function confirmInit(targetDir) {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Initialize lumi-kit in ${targetDir}?`,
      default: true
    }
  ]);

  return confirm;
}

module.exports = {
  PLATFORMS,
  AGENTS,
  promptPlatform,
  promptAgents,
  confirmInit
};
