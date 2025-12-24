# Analyze Codebase - Workflow Instructions

## Activation

**ON TRIGGER, EXECUTE:**

1. Check `{output_folder}/.checkpoint.json` exists
   - **YES** → Read checkpoint → Resume from `current_phase`
   - **NO** → Initialize new checkpoint → Start Phase 1

2. Execute phases sequentially until completion
3. Generate final report

---

## Phase 1: Structure Scan

<step n="1" goal="Scan project structure">
  <action>List all directories (exclude: node_modules, .git, dist, build)</action>
  <action>Count files by extension</action>
  <action>Detect framework from package.json, requirements.txt, Cargo.toml</action>
  <action>Identify entry points (main, index, app)</action>
</step>

<step n="2" goal="Save phase output">
  <action>Create file inventory with line counts</action>
  <action>Document detected tech stack</action>
  <template-output section="file-inventory"/>
</step>

<step n="3" goal="Update checkpoint">
  <action>Set current_phase: 2</action>
  <action>Add "P1" to completed array</action>
  <action>Save stats.files_analyzed count</action>
</step>

→ Proceed to Phase 2

---

## Phase 2: Code Analysis

<step n="1" goal="Read all source files">
  <iterate for-each="source_file in file_list">
    <action>Read complete file (chunk if >200 lines)</action>
    <action>Extract: imports, exports, functions, classes</action>
    <action>Map: dependencies, call relationships</action>
    <action>Track: `[✓] {filename} ({lines} lines) - complete`</action>
  </iterate>
</step>

<step n="2" goal="Build component registry">
  <action>List all classes with their methods</action>
  <action>List all standalone functions</action>
  <action>Identify services, controllers, utilities</action>
</step>

<step n="3" goal="Update checkpoint">
  <action>Set current_phase: 3</action>
  <action>Add "P2" to completed</action>
  <action>Save components list to checkpoint.data</action>
</step>

→ Proceed to Phase 3

---

## Phase 3: Architecture Diagrams

<step n="1" goal="Generate System Overview">
  <action>Create Mermaid graph TB diagram</action>
  <action>Show layers: UI → Services → Data</action>
  <action>Save to {output_folder}/architecture/overview.md</action>
  <template-output section="system-overview"/>
</step>

<step n="2" goal="Generate Dependency Graph">
  <action>Create Mermaid graph LR diagram</action>
  <action>Show module relationships</action>
  <action>Save to {output_folder}/architecture/dependencies.md</action>
</step>

<step n="3" goal="Update checkpoint">
  <action>Set current_phase: 4</action>
  <action>Add "P3" to completed</action>
</step>

→ Proceed to Phase 4

---

## Phase 4: Component Documentation

<step n="1" goal="Generate component docs">
  <iterate for-each="component in components_list">
    <action>Load template from {module-path}/templates/component.md</action>
    <action>Generate class diagram with properties and methods</action>
    <action>Document purpose, dependencies, usage</action>
    <action>Save to {output_folder}/components/{ComponentName}.md</action>
    <action>Track: `[✓] {ComponentName}.md - created`</action>
  </iterate>
</step>

<step n="2" goal="Verify coverage">
  <action>Count components found vs documented</action>
  <check if="count mismatch">
    <action>Create missing component docs</action>
  </check>
</step>

<step n="3" goal="Update checkpoint">
  <action>Update stats.components_documented</action>
  <action>Set current_phase: 5</action>
  <action>Add "P4" to completed</action>
</step>

→ Proceed to Phase 5

---

## Phase 5: Flow Documentation

<step n="1" goal="Identify all flows">
  <action>Find: route handlers, event listeners, callbacks</action>
  <action>Find: lifecycle methods, middleware, jobs</action>
  <action>Create flow registry with trigger types</action>
</step>

<step n="2" goal="Generate flow docs">
  <iterate for-each="flow in flows_list">
    <action>Load template from {module-path}/templates/flow.md</action>
    <action>Generate flowchart with decision points</action>
    <action>Generate sequence diagram if multi-component</action>
    <action>Save to {output_folder}/flows/{flow-name}.md</action>
  </iterate>
</step>

<step n="3" goal="Update checkpoint">
  <action>Update stats.flows_documented</action>
  <action>Set current_phase: 6</action>
  <action>Add "P5" to completed</action>
</step>

→ Proceed to Phase 6

---

## Phase 6: API Documentation

<step n="1" goal="Identify public APIs">
  <action>Find: exported functions, public methods</action>
  <action>Find: REST endpoints, GraphQL resolvers</action>
</step>

<step n="2" goal="Generate API docs">
  <iterate for-each="module in modules_with_exports">
    <action>Load template from {module-path}/templates/api.md</action>
    <action>Document each function: signature, params, returns, example</action>
    <action>Save to {output_folder}/api/{module-name}.md</action>
  </iterate>
</step>

<step n="3" goal="Update checkpoint">
  <action>Update stats.apis_documented</action>
  <action>Set current_phase: 7</action>
  <action>Add "P6" to completed</action>
</step>

→ Proceed to Phase 7

---

## Phase 7: Security Audit

<step n="1" optional="true" goal="Scan for vulnerabilities">
  <action>Check: hardcoded secrets, API keys</action>
  <action>Check: input validation, SQL injection risks</action>
  <action>Check: authentication/authorization patterns</action>
  <action>Check: dependency vulnerabilities</action>
</step>

<step n="2" goal="Generate security report">
  <action>Categorize issues: 🔴 Critical, 🟠 Important, 🟡 Minor</action>
  <action>Save to {output_folder}/reports/security.md</action>
</step>

→ Proceed to Phase 8

---

## Phase 8: Performance Audit

<step n="1" optional="true" goal="Check performance">
  <action>Identify: O(n²) or worse algorithms</action>
  <action>Check: blocking I/O operations</action>
  <action>Check: memory leak patterns</action>
  <action>Check: unnecessary re-renders (React)</action>
</step>

<step n="2" goal="Generate performance report">
  <action>Save to {output_folder}/reports/performance.md</action>
</step>

→ Proceed to Phase 9

---

## Phase 9: Quality Review

<step n="1" optional="true" goal="Check code quality">
  <action>Find: code smells, god classes</action>
  <action>Find: code duplication</action>
  <action>Find: missing error handling</action>
  <action>Calculate: quality score 1-10</action>
</step>

<step n="2" goal="Generate quality report">
  <action>Save to {output_folder}/reports/quality.md</action>
</step>

→ Proceed to Phase 10

---

## Phase 10: Guides & Summary

<step n="1" goal="Create documentation structure">
  <action>Create {output_folder}/README.md with project overview</action>
  <action>Create {output_folder}/SUMMARY.md with table of contents</action>
  <action>Create {output_folder}/guides/setup.md</action>
  <action>Create {output_folder}/guides/development.md</action>
</step>

→ Proceed to Phase 11

---

## Phase 11: Web Viewer

<step n="1" optional="true" goal="Create web viewer">
  <action>Create {output_folder}/index.html with:</action>
  <action>  - Mermaid.js for diagram rendering</action>
  <action>  - Navigation sidebar</action>
  <action>  - Search functionality</action>
  <action>  - Dark/light mode</action>
</step>

<step n="2" goal="Start local server">
  <action>Run: cd {output_folder} && python3 -m http.server 8080</action>
  <action>Report: 🌐 http://localhost:8080</action>
</step>

---

## Final Verification

```
Before completing, verify ALL counts match:

COMPONENTS:
  Found in code: [X]
  Files created: [X] ✓

FLOWS:
  Routes: [A] files: [A] ✓
  Events: [B] files: [B] ✓
  Callbacks: [C] files: [C] ✓

APIS:
  Modules: [Y]
  Files created: [Y] ✓

⚠️ ANY mismatch → Go back and create missing files
```

## Final Report

```
✅ DOCUMENTATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files analyzed: [X]
Diagrams generated: [Y]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Components: [count] docs
Flows: [count] docs
APIs: [count] docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security: 🔴[X] 🟠[Y] 🟡[Z]
Quality: [X]/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 http://localhost:8080
```

## Auto-Resume

If interrupted, simply re-trigger the workflow.
The agent will automatically:
1. Detect existing `.checkpoint.json`
2. Read last completed phase
3. Complete any pending items
4. Continue from where it stopped

**No manual "continue" command needed.**
