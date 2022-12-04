import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@services': 'src/services',
			'@utils': 'src/utils'
		}
	},
	preprocess: [preprocess()]
};

export default config;
