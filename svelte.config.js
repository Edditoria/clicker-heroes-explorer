import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// (adapter-static) default options are shown. On some platforms
			// (adapter-static) these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true,
		}),
		files: {
			assets: 'website/static',
			hooks: {
				client: 'website/hooks.client',
				server: 'website/hooks.server',
				universal: 'website/hooks',
			},
			lib: 'website/lib',
			params: 'website/params',
			routes: 'website/routes',
			serviceWorker: 'website/service-worker',
			appTemplate: 'website/app.html',
			errorTemplate: 'website/error.html',
		},
	},
};

export default config;
