import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name][extname]'
			}
		}
	},
	server: {
		fs: {
			allow: [
				'../qa-atp-osm/',
				'../qa-motorway-milestones/',
				'../qa-road-network/',
				'../qa-waste-containers/'
			]
		}
	}
});
