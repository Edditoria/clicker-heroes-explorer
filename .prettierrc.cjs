module.exports = {
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: false, // as default.
	trailingComma: 'es5', // as default. SvelteKit default: 'none'.
	bracketSpacing: true, // as default.
	printWidth: 999, // SvelteKit default: 100.
	plugins: ['prettier-plugin-svelte'],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};
