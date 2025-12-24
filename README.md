# 🌟 Lumi-Kit v2

AI-driven development toolkit with **modular architecture** following BMAD patterns.

[![npm version](https://img.shields.io/npm/v/lumi-kit.svg)](https://www.npmjs.com/package/lumi-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ What's New in v2

- 🏗️ **Modular Architecture** - Separate modules for docs, git, review
- 🤖 **YAML Agents** - Rich agent definitions with personas and menus
- 🔄 **Workflow System** - Multi-step guided workflows with checkpoints
- 📦 **Module Manifest** - Install only what you need

## 🚀 Quick Start

```bash
# Install with npx
npx lumi-kit@latest init .

# Or install globally
npm install -g lumi-kit
lumi-kit init .
```

## 📦 Modules

| Module | Description | Agents |
|--------|-------------|--------|
| **core** | Master orchestrator | lumi-master |
| **docs** | 11-phase documentation generator | docs-architect |
| **git** | Semantic commits & PR helper | git-expert |
| **review** | Code review specialist | review-specialist |

## 🔌 Supported Platforms

| Platform | Directory | Format |
|----------|-----------|--------|
| Claude Code | `.claude/commands/` | Markdown |
| Cursor | `.cursor/rules/` | Markdown (.mdc) |
| Antigravity | `.agent/skills/` | Markdown |
| Codex | `.codex/commands/` | Markdown |
| Gemini CLI | `.gemini/commands/` | TOML |

## 📂 Project Structure

After `lumi-kit init`, your project will have:

```
your-project/
├── .claude/commands/           # Platform agents
│   ├── lumi-master.md
│   ├── lumi-docs-architect.md
│   └── ...
└── _lumi/                      # Lumi core
    ├── config.yaml             # Configuration
    ├── agents/                 # Agent YAML definitions
    ├── workflows/              # Workflow definitions
    └── templates/              # Doc templates
```

## 🤖 Agents

### Lumi Master (core)
Master orchestrator that coordinates all modules.

```yaml
agent:
  metadata:
    name: "Lumi Master"
    icon: "🌟"
  persona:
    role: "Master Orchestrator"
  menu:
    - trigger: "docs" → Generate documentation
    - trigger: "git" → Git workflow
    - trigger: "review" → Code review
```

### Docs Architect (docs)
11-phase documentation generator with checkpoints.

**Phases:**
1. Structure Scan
2. Code Analysis
3. Architecture Diagrams
4. Component Documentation
5. Flow Documentation
6. API Documentation
7. Security Audit
8. Performance Audit
9. Quality Review
10. Guides & Summary
11. Web Viewer

### Git Expert (git)
Semantic commits following Conventional Commits.

**Commands:**
- `commit` - Generate semantic commit message
- `pr` - Generate PR description
- `changelog` - Generate changelog entries

### Review Specialist (review)
Comprehensive code review with severity levels.

**Review Areas:**
- 🔒 Security vulnerabilities
- ⚡ Performance issues
- ✨ Code quality
- 🧪 Test coverage

## 🔄 Workflows

Workflows are multi-step guided processes:

```yaml
workflow:
  metadata:
    name: "Analyze Codebase"
  phases:
    - id: "P1"
      name: "Structure Scan"
      goal: "Scan directories, list files"
    - id: "P2"
      name: "Code Analysis"
      goal: "Extract components"
  instructions: "instructions.md"
```

## ⚙️ Configuration

`_lumi/config.yaml`:

```yaml
user_name: "Developer"
communication_language: "English"
output_folder: "docs"
checkpoint_enabled: true

modules:
  - core
  - docs
  - git
  - review

platform: "claude"
```

## 🛠️ Commands

```bash
lumi-kit init [path]      # Initialize in project
lumi-kit init . --all     # All platforms
lumi-kit check            # Check requirements
```

## 📋 BMAD Architecture

Lumi-Kit v2 follows the [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) patterns:

- **Modular design** - Core + optional modules
- **YAML agents** - Rich definitions with personas
- **Workflows** - Step-by-step guided processes
- **Checkpoint system** - Resume interrupted work

## 📄 License

MIT © [Nghi-NV](https://github.com/Nghi-NV)

## 🔗 Links

- [GitHub](https://github.com/Nghi-NV/lumi-kit)
- [Issues](https://github.com/Nghi-NV/lumi-kit/issues)
