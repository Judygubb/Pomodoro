import { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';

// IndexedDB helper functions for storing binary database files
const DB_NAME = "PomodoroSQLiteDB";
const STORE_NAME = "sqlite_store";
const KEY = "db_file";

function saveToIndexedDB(uint8Array) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(uint8Array, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => reject(getReq.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export function useSQLite() {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadDatabase() {
      try {
        const SQL = await initSqlJs({
          locateFile: () => `/sql-wasm.wasm`
        });

        // Load existing database from IndexedDB instead of localStorage
        const savedUint8Array = await loadFromIndexedDB();
        let database;

        if (savedUint8Array) {
          database = new SQL.Database(savedUint8Array);
        } else {
          database = new SQL.Database();
          database.run(`
            CREATE TABLE IF NOT EXISTS songs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              artist TEXT NOT NULL,
              data BLOB NOT NULL
            );
          `);
        }

        setDb(database);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize SQLite with IndexedDB:", err);
      }
    }

    loadDatabase();
  }, []);

  // Save database changes to IndexedDB (supports large MP3 files easily)
  const saveToDisk = async () => {
    if (!db) return;
    try {
      const binaryArray = db.export();
      await saveToIndexedDB(binaryArray);
    } catch (err) {
      console.error("Failed to save database to IndexedDB:", err);
    }
  };

  return { db, isReady, saveToDisk };
}