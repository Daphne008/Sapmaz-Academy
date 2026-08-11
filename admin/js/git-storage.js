/**
 * SAPMAZ ACADEMY - GIT & JSON STORAGE ENGINE
 * Handles reading, writing, and deleting content JSON files.
 * Supports both Local Testing (localStorage/mock) and Direct GitHub REST API integration.
 */

class GitContentStorage {
  constructor(config = {}) {
    this.owner = config.owner || localStorage.getItem('sapmaz_git_owner') || 'Daphne008';
    this.repo = config.repo || localStorage.getItem('sapmaz_git_repo') || 'Sapmaz-Academy';
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
    let items = [];

    // Helper to normalize any item record into standard schema
    const normalizeRecord = (data) => {
      if (!data || typeof data !== 'object') return data;
      const statusVal = data.status || (data.active !== undefined ? (data.active ? 'Published' : 'Draft') : 'Published');
      const titleTRVal = data.titleTR || data.title || data.name || 'Untitled';
      const titleENVal = data.titleEN || data.titleTR || data.title || data.name || 'Untitled';
      const durationVal = data.duration || (data.durationHours ? `${data.durationHours} Saat` : '');
      const nextDateVal = data.nextDate || data.nextSessionDate || data.date || '';
      const excerptVal = data.excerpt || data.summaryTR || data.summary || '';
      const descriptionVal = data.description || data.body || '';

      return {
        _fileName: data._fileName || `${data.id || 'item'}.json`,
        category: data.category || 'General',
        fee: data.fee || '',
        author: data.author || 'Admin',
        date: data.date || '',
        ...data,
        titleTR: titleTRVal,
        titleEN: titleENVal,
        status: statusVal,
        duration: durationVal,
        nextDate: nextDateVal,
        excerpt: excerptVal,
        description: descriptionVal
      };
    };

    // 1. Try LocalStorage
    try {
      const stored = localStorage.getItem(`sapmaz_collection_${collectionName}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          items = parsed.map(normalizeRecord);
        }
      }
    } catch (e) {}

    if (!Array.isArray(items)) items = [];

    // 2. Fetch GitHub API if token exists or running remote
    if (this.token) {
      try {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/content/${collectionName}?ref=${this.branch}`;
        const response = await fetch(url, {
          headers: this._getHeaders()
        });
        if (response.ok) {
          const files = await response.json();
          if (Array.isArray(files)) {
            const jsonFiles = files.filter(f => f.name && f.name.endsWith('.json'));
            
            const fetched = await Promise.all(jsonFiles.map(async f => {
              try {
                const res = await fetch(f.download_url);
                if (res.ok) return await res.json();
              } catch (e) {}
              return null;
            }));

            fetched.forEach(data => {
              if (data && (data.id || data.titleTR || data.title || data.name)) {
                const itemRecord = normalizeRecord(data);

                const idx = items.findIndex(existing => (existing.id && data.id && existing.id === data.id) || existing._fileName === itemRecord._fileName);
                if (idx >= 0) {
                  items[idx] = itemRecord;
                } else {
                  items.push(itemRecord);
                }
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching collection list from GitHub:', err);
      }
    }

    return items.map(normalizeRecord);
  }

  // Save or update an item in a collection
  async saveItem(collectionName, fileName, data, commitMessage = '') {
    const filePath = `content/${collectionName}/${fileName}`;
    const jsonContent = JSON.stringify(data, null, 2);

    // 1. ALWAYS update local storage first so changes take effect immediately
    let collection = [];
    try {
      const stored = localStorage.getItem(`sapmaz_collection_${collectionName}`);
      if (stored) collection = JSON.parse(stored);
    } catch (e) {}

    const index = collection.findIndex(item => (item.id && data.id && item.id === data.id) || item._fileName === fileName);
    const itemRecord = { _fileName: fileName, ...data };

    if (index >= 0) {
      collection[index] = itemRecord;
    } else {
      collection.unshift(itemRecord);
    }

    localStorage.setItem(`sapmaz_collection_${collectionName}`, JSON.stringify(collection));

    // 2. If running locally or no token, return local success
    if (this.isLocal || !this.token) {
      return { success: true, mode: 'local', path: filePath, data: itemRecord };
    }

    // 3. GitHub API Mode
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
        console.warn('GitHub API sync warning:', errData.message);
        return { success: true, mode: 'local-fallback', path: filePath, data: itemRecord };
      }

      const result = await putRes.json();
      return { success: true, mode: 'github', commit: result.commit.sha, path: filePath };
    } catch (err) {
      console.warn('GitHub API sync error, saved locally:', err);
      return { success: true, mode: 'local-fallback', path: filePath, data: itemRecord };
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
