'use client';

import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Initialize QueryClient in a state to ensure it's only created client-side
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // CacheTime is available in the previous version.
                        gcTime: 1000 * 60 * 60 * 24, // 24 hours
                        staleTime: 1000 * 60 * 5, // 5 minutes
                    },
                },
            })
    );

    // Create persister for localStorage
    const persister = createSyncStoragePersister({
        storage: typeof window !== 'undefined' ? window.localStorage : null,
        key: 'react-query-cache',
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 1000 * 60 * 60 * 24, // Persist cache for 24 hours

            }}
        >
            {children}
            <ReactQueryDevtools initialIsOpen />
        </PersistQueryClientProvider>
    );
}