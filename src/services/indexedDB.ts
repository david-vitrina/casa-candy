import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Dish } from '@/types/menu';

interface AppDB extends DBSchema {
  dishes: {
    key: string;
    value: Dish;
    indexes: { 'by-category': string };
  };
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      profile: any;
      lastUpdated: number;
    };
  };
  images: {
    key: string;
    value: {
      url: string;
      blob: Blob;
      lastUpdated: number;
    };
  };
  sync_queue: {
    key: string;
    value: {
      id: string;
      operation: 'INSERT' | 'UPDATE' | 'DELETE';
      table: string;
      data: any;
      timestamp: number;
    };
  };
}

class IndexedDBService {
  private db: IDBPDatabase<AppDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<AppDB>('david-burger-db', 1, {
      upgrade(db) {
        // Dishes store
        const dishesStore = db.createObjectStore('dishes', { keyPath: 'id' });
        dishesStore.createIndex('by-category', 'category');

        // Users store
        db.createObjectStore('users', { keyPath: 'id' });

        // Images store
        db.createObjectStore('images', { keyPath: 'url' });

        // Sync queue store
        db.createObjectStore('sync_queue', { keyPath: 'id' });
      },
    });
  }

  async getDishes(): Promise<Dish[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('dishes');
  }

  async saveDishes(dishes: Dish[]): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('dishes', 'readwrite');
    await Promise.all(dishes.map(dish => tx.store.put(dish)));
    await tx.done;
  }

  async getDishesByCategory(category: string): Promise<Dish[]> {
    if (!this.db) await this.init();
    return await this.db!.getAllFromIndex('dishes', 'by-category', category);
  }

  async saveUser(user: { id: string; email: string; profile: any }): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('users', {
      ...user,
      lastUpdated: Date.now()
    });
  }

  async getUser(id: string): Promise<any> {
    if (!this.db) await this.init();
    return await this.db!.get('users', id);
  }

  async cacheImage(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('images', {
      url,
      blob,
      lastUpdated: Date.now()
    });
  }

  async getCachedImage(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    const cached = await this.db!.get('images', url);
    return cached?.blob || null;
  }

  async addToSyncQueue(operation: 'INSERT' | 'UPDATE' | 'DELETE', table: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    const id = `${table}-${operation}-${Date.now()}-${Math.random()}`;
    await this.db!.put('sync_queue', {
      id,
      operation,
      table,
      data,
      timestamp: Date.now()
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('sync_queue');
  }

  async clearSyncQueue(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear('sync_queue');
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('sync_queue', id);
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();
    const stores: ('dishes' | 'users' | 'images' | 'sync_queue')[] = ['dishes', 'users', 'images', 'sync_queue'];
    const tx = this.db!.transaction(stores, 'readwrite');
    await Promise.all(stores.map(storeName => tx.objectStore(storeName).clear()));
    await tx.done;
  }
}

export const indexedDBService = new IndexedDBService();