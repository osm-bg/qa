import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
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
