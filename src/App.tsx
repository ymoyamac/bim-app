import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { FormDevtoolsPanel } from '@tanstack/react-form-devtools';
import { RouterProvider } from 'react-router';

import { queryClient } from '@/lib';
import { router } from '@/router';

interface ProvidersProps {
    children?: ReactNode;
}

export function App({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <RouterProvider router={router} />
            {import.meta.env.DEV && (
                <TanStackDevtools
                    plugins={[
                        { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
                        { name: 'TanStack Form', render: <FormDevtoolsPanel /> },
                    ]}
                />
            )}
        </QueryClientProvider>
    );
}
