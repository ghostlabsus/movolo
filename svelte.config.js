import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
            resolve: {
                alias: {
                    // these are the aliases and paths to them
                    '@components': path.resolve('./src/components'),
                    '@lib': path.resolve('./src/lib'),
                    '@util': path.resolve('./src/util'),
					"@scrapers": path.resolve('./src/util/scrapers'),
					"@subtitles": path.resolve('./src/util/subtitles'),
					"@src": path.resolve('./src'),
                }
            }
        }
	}
};

export default config;
