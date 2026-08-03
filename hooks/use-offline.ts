'use client';

import { useEffect, useState, useCallback } from 'react';

interface OfflineState {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  pendingActions: number;
}

interface UseOfflineReturn extends OfflineState {
  cacheUrls: (urls: string[]) => void;
  clearCache: () => void;
  addPendingAction: (action: PendingAction) => Promise<void>;
  syncPendingActions: () => Promise<void>;
}

interface PendingAction {
  id: string;
  type: 'SUBMISSION' | 'ATTENDANCE' | 'GRADE';
  data: any;
  timestamp: number;
}

const DB_NAME = 'million-offline';
const STORE_NAME = 'pending-actions';

// IndexedDB helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export function useOffline(): UseOfflineReturn {
  const [state, setState] = useState<OfflineState>({
    isOnline: true,
    isServiceWorkerReady: false,
    pendingActions: 0,
  });

  // Monitor online status
  useEffect(() => {
    setState((prev) => ({ ...prev, isOnline: navigator.onLine }));

    const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          setState((prev) => ({ ...prev, isServiceWorkerReady: true }));
          console.log('[Offline] Service Worker registered');
        })
        .catch((err) => {
          console.error('[Offline] Service Worker registration failed:', err);
        });
    }
  }, []);

  // Count pending actions
  useEffect(() => {
    const countPending = async () => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const count = await new Promise<number>((resolve) => {
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
        });
        setState((prev) => ({ ...prev, pendingActions: count }));
      } catch {
        // IndexedDB not available
      }
    };

    countPending();
    const interval = setInterval(countPending, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cache specific URLs
  const cacheUrls = useCallback((urls: string[]) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls,
      });
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE',
      });
    }
  }, []);

  // Add pending action for offline sync
  const addPendingAction = useCallback(async (action: PendingAction) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const request = store.add(action);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      setState((prev) => ({ ...prev, pendingActions: prev.pendingActions + 1 }));
    } catch (err) {
      console.error('[Offline] Failed to add pending action:', err);
    }
  }, []);

  // Sync pending actions when online
  const syncPendingActions = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      const actions = await new Promise<PendingAction[]>((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
      });

      for (const action of actions) {
        try {
          // Sync based on action type
          let endpoint = '';
          switch (action.type) {
            case 'SUBMISSION':
              endpoint = '/api/assignments/submit';
              break;
            case 'ATTENDANCE':
              endpoint = '/api/attendance';
              break;
            case 'GRADE':
              endpoint = '/api/grades';
              break;
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data),
          });

          if (response.ok) {
            // Remove synced action
            const deleteTx = db.transaction(STORE_NAME, 'readwrite');
            const deleteStore = deleteTx.objectStore(STORE_NAME);
            await new Promise<void>((resolve) => {
              const request = deleteStore.delete(action.id);
              request.onsuccess = () => resolve();
            });
          }
        } catch {
          console.error('[Offline] Failed to sync action:', action.id);
        }
      }

      // Update count
      const countTx = db.transaction(STORE_NAME, 'readonly');
      const countStore = countTx.objectStore(STORE_NAME);
      const remaining = await new Promise<number>((resolve) => {
        const request = countStore.count();
        request.onsuccess = () => resolve(request.result);
      });
      setState((prev) => ({ ...prev, pendingActions: remaining }));
    } catch (err) {
      console.error('[Offline] Sync failed:', err);
    }
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (state.isOnline && state.pendingActions > 0) {
      syncPendingActions();
    }
  }, [state.isOnline, state.pendingActions, syncPendingActions]);

  return {
    ...state,
    cacheUrls,
    clearCache,
    addPendingAction,
    syncPendingActions,
  };
}
