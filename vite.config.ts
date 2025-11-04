import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProd = mode === 'production'
    console.log(`Running on ${isProd ? "Production" : "Localhost"}`)
    return {
        plugins: [tailwindcss(), sveltekit()],
        server: {
            allowedHosts: [
                "quizily.boon4681.com"
            ],
            proxy: {
                '/api': {
                    target: isProd ? env.VITE_BACKEND ?? 'http://localhost:3000' : 'http://localhost:3000',
                    rewrite: (p) => p.replace('/api/', '/')
                }
            }
        },
    }
});
