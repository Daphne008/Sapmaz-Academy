/**
 * SAPMAZ ACADEMY - GIT & JSON STORAGE ENGINE
 * Handles reading, writing, and deleting content JSON files.
 * Supports both Local Testing (localStorage/mock) and Direct GitHub REST API integration.
 */

class GitContentStorage {
  constructor(config = {}) {
    this.owner = config.owner || localStorage.getItem('sapmaz_git_owner') || 'sapmaz-academy';
    this.repo = config.repo || localStorage.getItem('sapmaz_git_repo') || 'sapmaz-website';
    this.branch = config.branch || localStorage.getItem('sapmaz_git_branch') || 'main';
    this.token = config.token || localStorage.getItem('sapmaz_git_token') || '';
    this.isLocal = config.isLocal !== undefined ? config.isLocal : !this.token;
  }

  // Save full Git configuration
  setConfig({ owner, repo, branch, token }) {
    if (owner) {
      this.owner = owner.trim();
      localStorage.setItem('sapmaz_git_owner', this.owner);
    }
    if (repo) {
      this.repo = repo.trim();
      localStorage.setItem('sapmaz_git_repo', this.repo);
    }
    if (branch) {
      this.branch = branch.trim();
      localStorage.setItem('sapmaz_git_branch', this.branch);
    }
    this.token = token ? token.trim() : '';
    if (this.token) {
      localStorage.setItem('sapmaz_git_token', this.token);
    } else {
      localStorage.removeItem('sapmaz_git_token');
    }
    this.isLocal = !this.token;
  }

  // Fetch list of items in a content collection (e.g. 'news', 'courses', 'applications', 'contacts')
  async listCollection(collectionName) {
    if (this.isLocal) {
      const stored = localStorage.getItem(`sapmaz_collection_${collectionName}`);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/content/${collectionName}?ref=${this.branch}`;
      const response = await fetch(url, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);
      const files = await response.json();
      return files.filter(f => f.name.endsWith('.json'));
    } catch (err) {
      console.error('Error fetching collection list:', err);
      return null;
    }
  }

  // Save or update an item in a collection
  async saveItem(collectionName, fileName, data, commitMessage = '') {
    const filePath = `content/${collectionName}/${fileName}`;
    const jsonContent = JSON.stringify(data, null, 2);

    if (this.isLocal) {
      let collection = (await this.listCollection(collectionName)) || [];
      const index = collection.findIndex(item => (item.id && data.id && item.id === data.id) || item._fileName === fileName);
      const itemRecord = { _fileName: fileName, ...data };

      if (index >= 0) {
        collection[index] = itemRecord;
      } else {
        collection.unshift(itemRecord);
      }

      localStorage.setItem(`sapmaz_collection_${collectionName}`, JSON.stringify(collection));
      return { success: true, mode: 'local', path: filePath, data: itemRecord };
    }

    // GitHub API Mode
    try {
      let sha = null;
      try {
        const getUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${this.branch}`;
        const getRes = await fetch(getUrl, { headers: this._getHeaders() });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }
      } catch (e) {
        // File does not exist yet
      }

      const encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));
      const putUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`;
      const body = {
        message: commitMessage || `[Admin Panel] Update ${collectionName}/${fileName}`,
        content: encodedContent,
        branch: this.branch
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: this._getHeaders(),
        body: JSON.stringify(body)
      });

      if (!putRes.ok) {
        const errData = await putRes.json();
        throw new Error(errData.message || 'Failed to commit file to GitHub');
      }

      const result = await putRes.json();
      return { success: true, mode: 'github', commit: result.commit.sha, path: filePath };
    } catch (err) {
      console.error('Error saving file to GitHub:', err);
      throw err;
    }
  }

  // Save full collection array (Local mode helper)
  saveFullCollection(collectionName, collectionData) {
    localStorage.setItem(`sapmaz_collection_${collectionName}`, JSON.stringify(collectionData));
  }

  // Delete an item from a collection
  async deleteItem(collectionName, fileName, itemId = null, commitMessage = '') {
    const filePath = `content/${collectionName}/${fileName}`;

    if (this.isLocal) {
      let collection = (await this.listCollection(collectionName)) || [];
      collection = collection.filter(item => {
        if (itemId && item.id) return item.id !== itemId;
        return item._fileName !== fileName;
      });
      localStorage.setItem(`sapmaz_collection_${collectionName}`, JSON.stringify(collection));
      return { success: true, mode: 'local' };
    }

    try {
      const getUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${this.branch}`;
      const getRes = await fetch(getUrl, { headers: this._getHeaders() });
      if (!getRes.ok) throw new Error('File not found for deletion');
      const fileInfo = await getRes.json();

      const delUrl = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`;
      const delRes = await fetch(delUrl, {
        method: 'DELETE',
        headers: this._getHeaders(),
        body: JSON.stringify({
          message: commitMessage || `[Admin Panel] Delete ${collectionName}/${fileName}`,
          sha: fileInfo.sha,
          branch: this.branch
        })
      });

      if (!delRes.ok) throw new Error('Failed to delete file from GitHub');
      return { success: true, mode: 'github' };
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  }

  _getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }
}

// Global Export
window.GitContentStorage = GitContentStorage;
