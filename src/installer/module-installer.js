const path = require('path');
const fs = require('fs').promises;
const ora = require('ora');
const { files } = require('../cli/utils/files');
const { logger } = require('../cli/utils/logger');

/**
 * Module-based installer for Lumi-Kit v2
 * Uses YAML agent/workflow format following BMAD architecture
 */
class ModuleInstaller {
  constructor(targetDir, options = {}) {
    this.targetDir = targetDir;
    this.options = options;
    this.srcDir = path.join(__dirname, '..');
    this.manifestPath = path.join(this.srcDir, 'manifest.yaml');
  }

  /**
   * Load manifest.yaml
   */
  async loadManifest() {
    const content = await files.readFile(this.manifestPath);
    // Simple YAML parsing for our structured manifest
    return this.parseSimpleYaml(content);
  }

  /**
   * Simple YAML parser for our manifest structure
   */
  parseSimpleYaml(content) {
    // For simplicity, we'll parse the key sections we need
    const manifest = {
      modules: [],
      platforms: {}
    };

    // Extract modules section
    const modulesMatch = content.match(/modules:\n([\s\S]*?)(?=\nplatforms:|$)/);
    if (modulesMatch) {
      const moduleBlocks = modulesMatch[1].split(/\n  - code:/);
      for (const block of moduleBlocks) {
        if (block.trim()) {
          const codeMatch = block.match(/^(\w+)/m) || block.match(/code:\s*(\w+)/);
          const nameMatch = block.match(/name:\s*"([^"]+)"/);
          const pathMatch = block.match(/path:\s*"?([^\n"]+)"?/);

          if (codeMatch) {
            manifest.modules.push({
              code: codeMatch[1].trim(),
              name: nameMatch ? nameMatch[1] : codeMatch[1],
              path: pathMatch ? pathMatch[1].trim() : `modules/${codeMatch[1]}`
            });
          }
        }
      }
    }

    // Extract platforms section
    const platformsMatch = content.match(/platforms:\n([\s\S]*?)$/);
    if (platformsMatch) {
      const platformBlocks = platformsMatch[1].split(/\n  (\w+):/);
      for (let i = 1; i < platformBlocks.length; i += 2) {
        const platformKey = platformBlocks[i];
        const platformData = platformBlocks[i + 1] || '';

        const nameMatch = platformData.match(/name:\s*"([^"]+)"/);
        const folderMatch = platformData.match(/folder:\s*"([^"]+)"/);
        const extensionMatch = platformData.match(/extension:\s*"([^"]+)"/);
        const formatMatch = platformData.match(/format:\s*"?(\w+)"?/);

        manifest.platforms[platformKey] = {
          name: nameMatch ? nameMatch[1] : platformKey,
          folder: folderMatch ? folderMatch[1] : `.${platformKey}/commands/`,
          extension: extensionMatch ? extensionMatch[1] : '.md',
          format: formatMatch ? formatMatch[1] : 'markdown'
        };
      }
    }

    return manifest;
  }

  /**
   * Install selected modules for platforms
   */
  async installModules(moduleNames, platformKey) {
    const spinner = ora('Loading manifest...').start();

    try {
      const manifest = await this.loadManifest();
      const platform = manifest.platforms[platformKey];

      if (!platform) {
        throw new Error(`Unknown platform: ${platformKey}`);
      }

      spinner.text = 'Installing modules...';

      // Create platform directory
      const platformDir = path.join(this.targetDir, platform.folder);
      await files.ensureDir(platformDir);

      // Create _lumi directory structure
      const lumiDir = path.join(this.targetDir, '_lumi');
      await files.ensureDir(path.join(lumiDir, 'agents'));
      await files.ensureDir(path.join(lumiDir, 'workflows'));
      await files.ensureDir(path.join(lumiDir, 'templates'));

      // Install each module
      for (const moduleName of moduleNames) {
        const module = manifest.modules.find(m => m.code === moduleName);
        if (module) {
          await this.installModule(module, platform, platformDir, lumiDir);
        }
      }

      // Create config.yaml
      await this.createConfig(lumiDir, moduleNames, platformKey);

      spinner.succeed('Modules installed successfully');
    } catch (error) {
      spinner.fail('Failed to install modules');
      throw error;
    }
  }

  /**
   * Install a single module
   */
  async installModule(module, platform, platformDir, lumiDir) {
    const modulePath = path.join(this.srcDir, module.path);

    // Check for agents
    const agentsPath = path.join(modulePath, 'agents');
    try {
      const agentFiles = await fs.readdir(agentsPath);
      for (const file of agentFiles) {
        if (file.endsWith('.agent.yaml')) {
          const agentContent = await files.readFile(path.join(agentsPath, file));

          // Convert YAML agent to platform format
          const converted = this.convertAgentForPlatform(agentContent, platform);

          // Get base name without .agent.yaml
          const baseName = file.replace('.agent.yaml', '');
          const destName = `lumi-${baseName}${platform.extension}`;

          // Write to platform directory
          await files.writeFile(path.join(platformDir, destName), converted);
          logger.success(`Created ${platform.folder}${destName}`);

          // Also copy original YAML to _lumi
          await files.writeFile(path.join(lumiDir, 'agents', file), agentContent);
        }
      }
    } catch (e) {
      // No agents directory, skip
    }

    // Check for templates
    const templatesPath = path.join(modulePath, 'templates');
    try {
      const templateFiles = await fs.readdir(templatesPath);
      for (const file of templateFiles) {
        const content = await files.readFile(path.join(templatesPath, file));
        await files.writeFile(path.join(lumiDir, 'templates', file), content);
        logger.success(`Created _lumi/templates/${file}`);
      }
    } catch (e) {
      // No templates directory, skip
    }

    // Check for workflows
    const workflowsPath = path.join(modulePath, 'workflows');
    try {
      const workflowDirs = await fs.readdir(workflowsPath);
      for (const dir of workflowDirs) {
        const workflowDir = path.join(workflowsPath, dir);
        const stats = await fs.stat(workflowDir);
        if (stats.isDirectory()) {
          const destDir = path.join(lumiDir, 'workflows', dir);
          await files.ensureDir(destDir);

          const workflowFiles = await fs.readdir(workflowDir);
          for (const file of workflowFiles) {
            const content = await files.readFile(path.join(workflowDir, file));
            await files.writeFile(path.join(destDir, file), content);
          }
          logger.success(`Created _lumi/workflows/${dir}/`);
        }
      }
    } catch (e) {
      // No workflows directory, skip
    }
  }

  /**
   * Convert YAML agent to platform-specific format
   */
  convertAgentForPlatform(yamlContent, platform) {
    // Parse agent YAML to extract key fields
    const metadata = this.extractYamlSection(yamlContent, 'metadata');
    const persona = this.extractYamlSection(yamlContent, 'persona');
    const menu = this.extractYamlSection(yamlContent, 'menu');

    const name = this.extractYamlValue(metadata, 'name') || 'Lumi Agent';
    const title = this.extractYamlValue(metadata, 'title') || name;
    const icon = this.extractYamlValue(metadata, 'icon') || '🌟';
    const role = this.extractYamlValue(persona, 'role') || 'AI Assistant';
    const identity = this.extractYamlValue(persona, 'identity') || '';

    // Generate platform-specific format
    if (platform.format === 'toml') {
      return this.generateToml(name, title, icon, role, identity, persona, menu);
    }

    // Default: Markdown format
    return this.generateMarkdown(name, title, icon, role, identity, persona, menu, yamlContent);
  }

  /**
   * Generate TOML format (for Gemini)
   */
  generateToml(name, title, icon, role, identity, persona, menu) {
    const description = `${icon} ${title}`;

    let prompt = `# ${name}\n\n`;
    prompt += `## YOUR ROLE\n`;
    prompt += `You are a **${role}**.\n\n`;
    if (identity) {
      prompt += `${identity}\n\n`;
    }

    return `description = "${description}"

prompt = """
${prompt}
"""
`;
  }

  /**
   * Generate Markdown format (for most platforms)
   */
  generateMarkdown(name, title, icon, role, identity, persona, menu, originalYaml) {
    // Extract description from original YAML
    const descMatch = originalYaml.match(/title:\s*"([^"]+)"/);
    const description = descMatch ? descMatch[1] : title;

    // Generate trigger line
    const triggerMatch = name.toLowerCase().replace(' ', '-');

    let md = `---
description: ${description}
trigger: "${triggerMatch}" | "lumi ${triggerMatch}"
---

# ${icon} ${name}

## YOUR ROLE
You are a **${role}**.

${identity}

`;

    // Add principles if available
    const principles = this.extractYamlList(persona, 'principles');
    if (principles.length > 0) {
      md += `## PRINCIPLES\n`;
      for (const p of principles) {
        md += `- ${p}\n`;
      }
      md += '\n';
    }

    // Add menu if available
    const menuItems = this.extractMenuItems(menu);
    if (menuItems.length > 0) {
      md += `## COMMANDS\n`;
      md += `| Trigger | Description |\n`;
      md += `|---------|-------------|\n`;
      for (const item of menuItems) {
        md += `| \`${item.trigger}\` | ${item.description} |\n`;
      }
      md += '\n';
    }

    return md;
  }

  /**
   * Extract a YAML section
   */
  extractYamlSection(content, sectionName) {
    const regex = new RegExp(`${sectionName}:\\s*\\n([\\s\\S]*?)(?=\\n  \\w+:|\\n\\w+:|$)`);
    const match = content.match(regex);
    return match ? match[1] : '';
  }

  /**
   * Extract a simple YAML value
   */
  extractYamlValue(section, key) {
    const regex = new RegExp(`${key}:\\s*["']?([^"'\\n]+)["']?`);
    const match = section.match(regex);
    return match ? match[1].trim() : '';
  }

  /**
   * Extract YAML list items
   */
  extractYamlList(section, key) {
    const regex = new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n  \\w+:|$)`);
    const match = section.match(regex);
    if (!match) return [];

    const items = [];
    const lines = match[1].split('\n');
    for (const line of lines) {
      const itemMatch = line.match(/^\s*-\s*["']?(.+?)["']?$/);
      if (itemMatch) {
        items.push(itemMatch[1].trim());
      }
    }
    return items;
  }

  /**
   * Extract menu items from YAML
   */
  extractMenuItems(menuSection) {
    const items = [];
    const blocks = menuSection.split(/\n\s*-\s*trigger:/);

    for (const block of blocks) {
      if (block.trim()) {
        const trigger = block.match(/^["']?(\w+)["']?/);
        const desc = block.match(/description:\s*["']?([^"'\n]+)["']?/);

        if (trigger) {
          items.push({
            trigger: trigger[1],
            description: desc ? desc[1] : trigger[1]
          });
        }
      }
    }
    return items;
  }

  /**
   * Create config.yaml
   */
  async createConfig(lumiDir, modules, platform) {
    const config = `# Lumi Configuration
# Generated by lumi-kit v2.0.0

# User Settings
user_name: "Developer"
communication_language: "English"

# Output Settings
output_folder: "docs"
checkpoint_enabled: true

# Project Info
project:
  root: "${this.targetDir}"

# Installed Modules
modules:
${modules.map(m => `  - ${m}`).join('\n')}

# Platform
platform: "${platform}"

# Generated
created_at: "${new Date().toISOString()}"
`;

    await files.writeFile(path.join(lumiDir, 'config.yaml'), config);
    logger.success('Created _lumi/config.yaml');
  }
}

module.exports = { ModuleInstaller };
