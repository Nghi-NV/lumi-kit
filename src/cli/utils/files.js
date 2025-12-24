const fs = require('fs-extra');
const path = require('path');

/**
 * File operation utilities
 */
const files = {
  /**
   * Ensure directory exists
   */
  ensureDir: async (dirPath) => {
    await fs.ensureDir(dirPath);
  },

  /**
   * Copy template file to destination
   */
  copyTemplate: async (templatePath, destPath) => {
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(templatePath, destPath);
  },

  /**
   * Write content to file
   */
  writeFile: async (filePath, content) => {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  },

  /**
   * Read file content
   */
  readFile: async (filePath) => {
    return await fs.readFile(filePath, 'utf-8');
  },

  /**
   * Check if path exists
   */
  exists: async (filePath) => {
    return await fs.pathExists(filePath);
  },

  /**
   * Get templates directory path
   */
  getTemplatesDir: () => {
    return path.join(__dirname, '..', '..', 'templates');
  }
};

module.exports = { files };
