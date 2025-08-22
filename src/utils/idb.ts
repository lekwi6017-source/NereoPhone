// src/utils/idb.ts
import { openDB, type IDBPDatabase, type DBSchema } from 'idb';

const DB_NAME = 'NereoPhone';
const DB_VER = 1;
const FILES = 'files';

// 描述本库的表结构：只有一个 object store: "files"
interface LPDB extends DBSchema {
  [FILES]: {
    key: string;
    value: Blob | string | ArrayBuffer;
  };
}

let dbPromise: Promise<IDBPDatabase<LPDB>> | null = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<LPDB>(DB_NAME, DB_VER, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(FILES)) {
          db.createObjectStore(FILES);
        }
      },
    });
  }
  return dbPromise;
}

export async function idbSet(key: string, value: Blob | string | ArrayBuffer) {
  const db = await getDb();
  const tx = db.transaction(FILES, 'readwrite');
  await tx.store.put(value, key);
  await tx.done;
}

export async function idbGet<T = any>(key: string): Promise<T | undefined> {
  const db = await getDb();
  // idb 已经帮你做了泛型，这里断言成 T 方便上层使用
  const val = (await db.get(FILES, key)) as unknown as T | undefined;
  return val;
}

export async function idbKeys(): Promise<string[]> {
  const db = await getDb();
  const tx = db.transaction(FILES);
  const keys: string[] = [];
  let cursor = await tx.store.openKeyCursor();
  while (cursor) {
    keys.push(String(cursor.key));
    cursor = await cursor.continue();
  }
  return keys;
}

export async function idbDel(key: string) {
  const db = await getDb();
  const tx = db.transaction(FILES, 'readwrite');
  await tx.store.delete(key);
  await tx.done;
}
