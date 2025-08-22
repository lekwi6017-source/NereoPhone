import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

export const firebaseEnabled = !!(apiKey && projectId);

let app: any = null;
let db: any = null;
let auth: any = null;

export async function ensureFirebase() {
  if (!firebaseEnabled) return null;

  if (!app) {
    app = initializeApp({
      apiKey,
      authDomain,
      projectId,
      appId
    });
    db = getFirestore(app);
    auth = getAuth(app);
  }

  await new Promise<void>((resolve) => {
    const off = onAuthStateChanged(auth, (user) => {
      if (user) resolve();
      else signInAnonymously(auth).finally(() => resolve());
      off();
    });
  });

  return { app, db, auth };
}

// —— Firestore 简易工具（无则回退到 localStorage） ——

type DocMap = 'conversations' | 'prompts' | 'userProfiles' | 'moments';

export async function fsGetAll<T>(name: DocMap): Promise<T[]> {
  if (!firebaseEnabled || !db) {
    const raw = localStorage.getItem(`fs:${name}`);
    return raw ? (JSON.parse(raw) as T[]) : [];
  }
  const snap = await getDocs(collection(db, name));
  const res: any[] = [];
  snap.forEach((d: any) => res.push({ id: d.id, ...d.data() }));
  return res as T[];
}

export async function fsSetAll<T extends { id: string }>(
  name: DocMap,
  arr: T[]
) {
  if (!firebaseEnabled || !db) {
    localStorage.setItem(`fs:${name}`, JSON.stringify(arr));
    return;
  }
  // 简化：全量 upsert
  await Promise.all(
    arr.map((x) => setDoc(doc(db, name, x.id), { ...x }))
  );
}
