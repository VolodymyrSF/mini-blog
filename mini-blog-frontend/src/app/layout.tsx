import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <Providers>
            <div className="min-h-screen">{children}</div>
        </Providers>
        </body>
        </html>
    );
}
