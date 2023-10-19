class CacheStorage {
  #storage = new Map();

  add = <T>(key: string[], data: T, cacheTime = 300000) => {
    if (key.length === 0) return;

    const keyString = key.join(' ');

    this.#storage.set(keyString, data);
    setTimeout(() => {
      this.delete(keyString);
    }, cacheTime);
  };

  find = <T>(key?: string[]): null | T => {
    if (!key || !this.hasKey(key.join(' '))) return null;
    return this.#storage.get(key.join(' ')) as T;
  };

  private hasKey = (key: string) => this.#storage.has(key);

  private delete = (key: string) => this.#storage.delete(key);
}

const cacheStorage = new CacheStorage();

export default cacheStorage;
