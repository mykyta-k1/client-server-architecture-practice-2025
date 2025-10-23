const { randomUUID } = require('node:crypto');

class ResourceRepository {
  constructor() {
    this.storage = new Map();
  }

  async create(data) {
    const id = randomUUID();
    const syncedTimestamp = new Date();

    this.storage.set(id, {
      id,
      ...data,
      createdAt: syncedTimestamp,
      updatedAt: syncedTimestamp,
    });

    return this.storage.get(id);
  }

  async read(id) {
    if (id && !this.storage.has(id)) {
      throw new Error('Resource not found');
    }

    return id ? this.storage.get(id) : Array.from(this.storage.values());
  }

  async update(id, data) {
    if (!this.storage.has(id)) {
      throw new Error('Resource not found');
    }

    const updatedData = {
      ...this.storage.get(id),
      ...data,
      id,
    };

    this.storage.set(id, {
      ...updatedData,
      updatedAt: new Date(),
    });

    return this.storage.get(id);
  }

  async delete(id) {
    if (!this.storage.has(id)) {
      throw new Error('Resource not found');
    }

    const resource = this.storage.get(id);

    this.storage.delete(id);

    return resource;
  }
}

module.exports.resourceRepository = new ResourceRepository();
