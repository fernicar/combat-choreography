import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

const imageUrls = [
  'src/assets/bg-brawling.png',
  'src/assets/bg-dogfight.png',
  'src/assets/bg-magic.png',
  'src/assets/brawling_enemy_attack.png',
  'src/assets/brawling_enemy_defeat.png',
  'src/assets/brawling_enemy_hit.png',
  'src/assets/brawling_enemy_idle.png',
  'src/assets/brawling_enemy_victory.png',
  'src/assets/brawling_player_attack.png',
  'src/assets/brawling_player_defeat.png',
  'src/assets/brawling_player_hit.png',
  'src/assets/brawling_player_idle.png',
  'src/assets/brawling_player_victory.png',
  'src/assets/dogfight_enemy_attack.png',
  'src/assets/dogfight_enemy_defeat.png',
  'src/assets/dogfight_enemy_hit.png',
  'src/assets/dogfight_enemy_idle.png',
  'src/assets/dogfight_enemy_victory.png',
  'src/assets/dogfight_player_attack.png',
  'src/assets/dogfight_player_defeat.png',
  'src/assets/dogfight_player_hit.png',
  'src/assets/dogfight_player_idle.png',
  'src/assets/dogfight_player_victory.png',
  'src/assets/magic_enemy_attack.png',
  'src/assets/magic_enemy_defeat.png',
  'src/assets/magic_enemy_hit.png',
  'src/assets/magic_enemy_idle.png',
  'src/assets/magic_enemy_victory.png',
  'src/assets/magic_player_attack.png',
  'src/assets/magic_player_defeat.png',
  'src/assets/magic_player_hit.png',
  'src/assets/magic_player_idle.png',
  'src/assets/magic_player_victory.png'
];

const ImageCacheLoader = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dbName = 'imageCacheDB';
    const storeName = 'images';
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      let loadedCount = 0;

      const cacheImage = (url: string) => {
        return new Promise((resolve, reject) => {
          const readTransaction = db.transaction(storeName, 'readonly');
          const store = readTransaction.objectStore(storeName);
          const getRequest = store.get(url);

          getRequest.onsuccess = () => {
            if (getRequest.result) {
              loadedCount++;
              setProgress(Math.round((loadedCount / imageUrls.length) * 100));
              resolve(true); // Already cached
            } else {
              // Not in cache, fetch and add
              fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                  const writeTransaction = db.transaction(storeName, 'readwrite');
                  const writeStore = writeTransaction.objectStore(storeName);
                  const putRequest = writeStore.put(blob, url);

                  putRequest.onsuccess = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / imageUrls.length) * 100));
                    resolve(true);
                  };
                  putRequest.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                  };
                })
                .catch(reject);
            }
          };

          getRequest.onerror = (event) => {
            reject((event.target as IDBRequest).error);
          };
        });
      };

      Promise.all(imageUrls.map(cacheImage))
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to cache images:', error);
          setLoading(false); // Even if caching fails, proceed to avoid blocking the app
        });
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      setLoading(false); // Proceed if IndexedDB fails
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <div className="w-1/2">
          <p className="text-center mb-2">{progress}% loaded</p>
          <Progress value={progress} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ImageCacheLoader;
