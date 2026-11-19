import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: '/minotaur',
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon.ico',
                'pwa-192x192.png',
                'pwa-512x512.png',
            ],
            manifest: {
                name: 'Minotaur Checklist',
                short_name: 'Minotaur',
                description:
                    'Equipment checklist, history, and QR verification PWA',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                scope: '/minotaur/',
                start_url: '/minotaur/',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                navigateFallback: '/minotaur/index.html',
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
});
