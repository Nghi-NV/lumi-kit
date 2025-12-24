const path = require('path');
const ora = require('ora');
const { files } = require('../cli/utils/files');
const { logger } = require('../cli/utils/logger');

/**
 * Core installer - copies templates to project
 */
class Installer {
  constructor(targetDir, platform, platformConfig) {
    this.targetDir = targetDir;
    this.platform = platform;
    this.platformConfig = platformConfig;
    this.templatesDir = files.getTemplatesDir();
    this.selectedAgents = []; // Track selected agents
  }

  /**
   * Install agents for the selected platform
   */
  async installAgents(agents) {
    const spinner = ora('Installing agents...').start();
    this.selectedAgents = agents; // Store for later use

    try {
      // Create platform-specific commands directory
      const commandsDir = path.join(this.targetDir, this.platformConfig.commandsDir);
      await files.ensureDir(commandsDir);

      // Copy agent files
      for (const agent of agents) {
        const agentFileName = `lumi-agent-${agent}${this.platformConfig.extension}`;
        const destPath = path.join(commandsDir, agentFileName);

        // Read template and adapt for platform
        let content = await this.getAgentTemplate(agent);
        content = this.adaptForPlatform(content, agent);

        await files.writeFile(destPath, content);
        logger.success(`Created ${this.platformConfig.commandsDir}/${agentFileName}`);
      }

      spinner.succeed('Agents installed successfully');
    } catch (error) {
      spinner.fail('Failed to install agents');
      throw error;
    }
  }

  /**
   * Install shared .lumi-agent folder
   */
  async installSharedResources() {
    const spinner = ora('Installing shared resources...').start();

    try {
      const lumiAgentDir = path.join(this.targetDir, '.lumi-agent');

      // Create directory structure
      await files.ensureDir(path.join(lumiAgentDir, 'templates'));
      await files.ensureDir(path.join(lumiAgentDir, 'prompts'));

      // Copy shared templates
      const sharedTemplates = [
        { name: 'docs-template.md', dest: 'templates/docs-template.md' },
        { name: 'commit-template.md', dest: 'templates/commit-template.md' },
        { name: 'review-checklist.md', dest: 'templates/review-checklist.md' },
        { name: 'component.md', dest: 'templates/component.md' },
        { name: 'flow.md', dest: 'templates/flow.md' },
        { name: 'api.md', dest: 'templates/api.md' }
      ];

      for (const template of sharedTemplates) {
        const templatePath = path.join(this.templatesDir, 'shared', template.name);
        const destPath = path.join(lumiAgentDir, template.dest);

        let content;
        try {
          content = await files.readFile(templatePath);
        } catch {
          content = this.getDefaultSharedTemplate(template.name);
        }

        await files.writeFile(destPath, content);
        logger.success(`Created .lumi-agent/${template.dest}`);
      }

      // Copy shared prompts
      const sharedPrompts = [
        { name: 'analyze-code.md', dest: 'prompts/analyze-code.md' },
        { name: 'generate-docs.md', dest: 'prompts/generate-docs.md' },
        { name: 'semantic-commit.md', dest: 'prompts/semantic-commit.md' }
      ];

      for (const prompt of sharedPrompts) {
        const promptPath = path.join(this.templatesDir, 'shared', prompt.name);
        const destPath = path.join(lumiAgentDir, prompt.dest);

        let content;
        try {
          content = await files.readFile(promptPath);
        } catch {
          content = this.getDefaultPrompt(prompt.name);
        }

        await files.writeFile(destPath, content);
        logger.success(`Created .lumi-agent/${prompt.dest}`);
      }

      // Create config.json
      const configPath = path.join(lumiAgentDir, 'config.json');
      await files.writeFile(configPath, JSON.stringify({
        version: '1.0.0',
        platform: this.platform,
        platformName: this.platformConfig.name,
        agents: this.selectedAgents,
        createdAt: new Date().toISOString()
      }, null, 2));
      logger.success('Created .lumi-agent/config.json');

      spinner.succeed('Shared resources installed successfully');
    } catch (error) {
      spinner.fail('Failed to install shared resources');
      throw error;
    }
  }

  /**
   * Get agent template content
   */
  async getAgentTemplate(agent) {
    const templatePath = path.join(this.templatesDir, 'agents', `lumi-agent-${agent}.md`);

    try {
      return await files.readFile(templatePath);
    } catch {
      // Return default template if file doesn't exist
      return this.getDefaultAgentTemplate(agent);
    }
  }

  /**
   * Adapt template content for specific platform
   */
  adaptForPlatform(content, agent) {
    const agentDescriptions = {
      docs: 'Generate technical documentation for the codebase',
      git: 'Git workflow helper with semantic commits',
      review: 'Code review assistant with best practices'
    };

    // Platform-specific adaptations
    switch (this.platform) {
      case 'cursor':
        // Cursor uses .mdc format with specific frontmatter
        if (!content.startsWith('---')) {
          content = `---
description: ${agentDescriptions[agent] || 'Lumi Agent'}
globs: 
alwaysApply: false
---

${content}`;
        }
        break;

      case 'antigravity':
        // Antigravity uses skill format with trigger
        if (!content.includes('trigger:')) {
          const lines = content.split('\n');
          if (lines[0] === '---') {
            // Find end of frontmatter and add trigger if missing
            const endIndex = lines.indexOf('---', 1);
            if (endIndex > 0 && !lines.slice(0, endIndex).some(l => l.startsWith('trigger:'))) {
              lines.splice(endIndex, 0, `trigger: "${agent}" | "lumi ${agent}"`); content = lines.join('\n');
            }
          }
        }
        break;

      case 'claude':
      case 'gemini':
      case 'codex':
        // These platforms use standard markdown format
        // No additional adaptation needed
        break;
    }

    return content;
  }

  /**
   * Default agent templates (fallback)
   */
  getDefaultAgentTemplate(agent) {
    const templates = {
      docs: `---
description: Generate technical documentation for the codebase
trigger: "generate docs" | "document this" | "create documentation"
---

# Lumi Agent - Documentation Generator

## Purpose
Analyze codebase and generate comprehensive technical documentation.

## Instructions

1. **Scan Project Structure**
   - List all source files
   - Identify tech stack and frameworks
   - Map dependencies

2. **Generate Documentation**
   - Create architecture overview
   - Document each component
   - Generate API documentation
   - Create flow diagrams (Mermaid)

3. **Output**
   - Save docs to \`docs/\` folder
   - Include README updates
   - Generate table of contents

## Templates
Reference: \`.lumi-agent/templates/docs-template.md\`
`,

      git: `---
description: Git workflow helper with semantic commits
trigger: "commit" | "create pr" | "git help"
---

# Lumi Agent - Git Workflow

## Purpose
Assist with Git operations using best practices.

## Instructions

### Semantic Commits
Generate commit messages following conventional commits:
- \`feat:\` New feature
- \`fix:\` Bug fix
- \`docs:\` Documentation
- \`style:\` Formatting
- \`refactor:\` Code restructuring
- \`test:\` Adding tests
- \`chore:\` Maintenance

### PR Description
Generate detailed PR descriptions with:
- Summary of changes
- Related issues
- Testing performed
- Screenshots (if UI)

## Templates
Reference: \`.lumi-agent/templates/commit-template.md\`
`,

      review: `---
description: Code review assistant with best practices
trigger: "review code" | "check this" | "code review"
---

# Lumi Agent - Code Review

## Purpose
Perform thorough code reviews following best practices.

## Review Checklist

### 1. Code Quality
- [ ] Clean, readable code
- [ ] Proper naming conventions
- [ ] No code duplication
- [ ] Appropriate comments

### 2. Security
- [ ] Input validation
- [ ] No hardcoded secrets
- [ ] Proper authentication
- [ ] SQL injection prevention

### 3. Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Proper caching
- [ ] Memory management

### 4. Testing
- [ ] Unit tests included
- [ ] Edge cases covered
- [ ] Integration tests

## Templates
Reference: \`.lumi-agent/templates/review-checklist.md\`
`
    };

    return templates[agent] || '# Agent Template\n\nNo template available.';
  }

  /**
   * Default shared templates (fallback)
   */
  getDefaultSharedTemplate(name) {
    const templates = {
      'docs-template.md': `# {{Component Name}}

## Overview
Brief description of the component.

## Architecture
\`\`\`mermaid
graph TD
    A[Input] --> B[Process]
    B --> C[Output]
\`\`\`

## API Reference
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| | | | |

## Usage Example
\`\`\`
// Example code here
\`\`\`
`,

      'commit-template.md': `# Commit Message Template

## Format
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

## Types
- feat: New feature
- fix: Bug fix  
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance

## Example
\`\`\`
feat(auth): add OAuth2 login support

- Implement Google OAuth2 flow
- Add token refresh mechanism
- Store tokens securely

Closes #123
\`\`\`
`,

      'review-checklist.md': `# Code Review Checklist

## ✅ Code Quality
- [ ] Code is clean and readable
- [ ] Follows project conventions
- [ ] No unnecessary complexity
- [ ] Proper error handling

## 🔒 Security
- [ ] Input validation
- [ ] No exposed secrets
- [ ] Proper authentication
- [ ] Authorization checks

## ⚡ Performance
- [ ] Efficient algorithms
- [ ] No memory leaks
- [ ] Proper caching
- [ ] Database query optimization

## 🧪 Testing
- [ ] Unit tests added
- [ ] Edge cases covered
- [ ] Tests pass locally
`
    };

    return templates[name] || '# Template\n';
  }

  /**
   * Default prompts (fallback)
   */
  getDefaultPrompt(name) {
    const prompts = {
      'analyze-code.md': `# Code Analysis Prompt

Analyze the following code and provide:
1. Summary of functionality
2. Dependencies identified
3. Potential issues
4. Improvement suggestions
`,

      'generate-docs.md': `# Documentation Generation Prompt

Generate documentation for this code including:
1. Overview description
2. Function/method documentation
3. Usage examples
4. API reference table
`,

      'semantic-commit.md': `# Semantic Commit Prompt

Generate a commit message following conventional commits:
1. Choose appropriate type (feat/fix/docs/etc)
2. Add scope if applicable
3. Write clear subject line
4. Add body with details
5. Reference issues if any
`
    };

    return prompts[name] || '# Prompt\n';
  }
}

module.exports = { Installer };
