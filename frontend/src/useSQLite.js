import { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';

export function useSQLite() {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadDatabase() {
      // 1. Initialize SQL.js with the WASM file from CDN
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // 2. Check if a saved database already exists in localStorage
      const savedDbHex = localStorage.getItem('pomodoro_sqlite_songs');
      let database;

      if (savedDbHex) {
        // Load existing database from local storage
        const uInt8Array = new Uint8Array(JSON.parse(savedDbHex));
        database = new SQL.Database(uInt8Array);
      } else {
        // Create a brand new database and only the songs table
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
    }

    loadDatabase();
  }, []);

  // Helper function to save changes to localStorage
  const saveToDisk = () => {
    if (!db) return;
    const binaryArray = db.export();
    localStorage.setItem('pomodoro_sqlite_songs', JSON.stringify(Array.from(binaryArray)));
  };

  return { db, isReady, saveToDisk };
}