import React from 'react';

/**
 * Resilient lazy import wrapper that auto-handles stale deployment chunk errors (e.g. Vercel deployments).
 * If a dynamically imported module fails due to a missing hash asset on the CDN, it reloads the page once to pull the fresh index.html.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<any>,
  name: string = 'default'
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const pageHasAlreadyBeenReloaded = sessionStorage.getItem('ep_chunk_reload');

    try {
      const module = await componentImport();
      // Reset reload flag on successful import
      sessionStorage.removeItem('ep_chunk_reload');
      return { default: module[name] || module.default || module };
    } catch (error: any) {
      console.warn('[EduPulse Chunk Recovery] Dynamic import failed:', error);

      const isChunkError = 
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Importing a module script failed') ||
        error?.message?.includes('Loading chunk') ||
        error?.name === 'ChunkLoadError';

      if (isChunkError && !pageHasAlreadyBeenReloaded) {
        sessionStorage.setItem('ep_chunk_reload', 'true');
        window.location.reload();
        return new Promise(() => {}); // Pause until browser reloads
      }

      throw error;
    }
  });
}
