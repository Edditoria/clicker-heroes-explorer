import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
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
