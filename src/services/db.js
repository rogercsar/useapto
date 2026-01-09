const DB_NAME = 'useapto-db';
const DB_VERSION = 1;
const STORES = {
    PROFILE: 'recruiterProfile',
    CANDIDATES: 'candidates'
};

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject('Error opening database');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORES.PROFILE)) {
                db.createObjectStore(STORES.PROFILE);
            }
            if (!db.objectStoreNames.contains(STORES.CANDIDATES)) {
                db.createObjectStore(STORES.CANDIDATES);
            }
        };
    });
};

export const getData = async (storeName) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get('data');

        request.onerror = () => {
            reject('Error fetching data');
        };

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
};

export const saveData = async (storeName, data) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data, 'data');

        request.onerror = () => {
            reject('Error saving data');
        };

        request.onsuccess = () => {
            resolve('Data saved successfully');
        };
    });
};

export const STORES_ENUM = STORES;
