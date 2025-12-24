# 🚀 Lumi-Kit

AI-driven development toolkit with multi-platform support. Initialize AI agents for Claude Code, Cursor, Antigravity, Codex, and Gemini CLI with a single command.

[![npm version](https://img.shields.io/npm/v/lumi-kit.svg)](https://www.npmjs.com/package/lumi-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🤖 **Multi-platform support** - One command, all AI platforms
- 📁 **Shared resources** - Templates and prompts across platforms
- 🔄 **Checkpoint system** - Resume interrupted agent tasks
- 📚 **Pre-built agents** - Documentation, Git, and Code Review

## 📦 Installation

```bash
# Quick start with npx (no installation needed)
npx lumi-kit init .

# Or install globally
npm install -g lumi-kit
lumi-kit init .
```

## 🎯 Usage

### Interactive Mode
```bash
npx lumi-kit init .
```

### Non-interactive Mode
```bash
# Single platform
npx lumi-kit init . --platform claude -y
npx lumi-kit init . --platform cursor -y

# All platforms at once
npx lumi-kit init . --all -y
```

### Check System Requirements
```bash
npx lumi-kit check
```

## 🔌 Supported Platforms

| Platform | Config Location | Extension |
|----------|-----------------|-----------|
| Claude Code | `.claude/commands/` | `.md` |
| Cursor | `.cursor/rules/` | `.mdc` |
| Antigravity | `.agent/skills/` | `.md` |
| Codex (OpenAI) | `.codex/commands/` | `.md` |
| Gemini CLI | `.gemini/commands/` | `.md` |

## 🤖 Available Agents

### lumi-agent-docs
Documentation generator with 11-phase autonomous workflow:
- **Role**: Senior Technical Documentation Architect
- **Features**: Architecture diagrams, API docs, checkpoint system
- **Trigger**: "analyze this codebase" | "create docs"

### lumi-agent-git
Git workflow helper with semantic commits:
- **Role**: Git Workflow Expert
- **Features**: Conventional commits, PR descriptions, changelog
- **Trigger**: "commit" | "create pr" | "changelog"

### lumi-agent-review
Code review assistant with quality checks:
- **Role**: Senior Code Review Specialist
- **Features**: Security audit, performance check, SOLID review
- **Trigger**: "review code" | "check this"

## 📂 Project Structure

After running `lumi-kit init`, your project will have:

```
your-project/
├── .claude/commands/           # Claude Code agents
│   ├── lumi-agent-docs.md
│   ├── lumi-agent-git.md
│   └── lumi-agent-review.md
├── .cursor/rules/              # Cursor agents (with --all)
├── .agent/skills/              # Antigravity agents
├── .codex/commands/            # Codex agents
├── .gemini/commands/           # Gemini CLI agents
└── .lumi-agent/                # Shared resources
    ├── templates/
    │   ├── component.md        # Component doc template
    │   ├── flow.md             # Flow doc template
    │   ├── api.md              # API doc template
    │   └── ...
    ├── prompts/
    │   ├── analyze-code.md
    │   ├── generate-docs.md
    │   └── semantic-commit.md
    └── config.json             # Platform & agent config
```

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `lumi-kit init [path]` | Initialize lumi-kit in a project |
| `lumi-kit check` | Verify system requirements |
| `lumi-kit --help` | Show help information |

### Init Options

| Option | Description |
|--------|-------------|
| `-y, --yes` | Skip confirmation prompts |
| `--platform <name>` | Specify platform (claude\|cursor\|antigravity\|codex\|gemini) |
| `--all` | Install all platforms at once |

## 📝 Agent Usage

After initialization, use agents in your AI assistant:

```
/lumi-agent-docs     # Generate comprehensive documentation
/lumi-agent-git      # Help with Git workflow
/lumi-agent-review   # Perform code review
```

Or trigger with natural language:
- "analyze this codebase"
- "create a commit message"
- "review this code"

## 🔧 Requirements

- Node.js >= 18.0.0
- npm or yarn
- Git (for lumi-agent-git)

## 📄 License

MIT © [Nghi-NV](https://github.com/Nghi-NV)

## 🔗 Links

- [GitHub Repository](https://github.com/Nghi-NV/lumi-kit)
- [Report Issues](https://github.com/Nghi-NV/lumi-kit/issues)
