import adapter from '@sveltejs/adapter-static';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { getHighlighter } from 'shiki';
import rehypeExternalLinks from 'rehype-external-links';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeSlug from 'rehype-slug';
import rehypeToc from '@jsdevtools/rehype-toc';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const theme = 'catppuccin-mocha';
			const langs = ['javascript', 'typescript', 'bash', 'svelte', 'clojure'];
			const highlighter = await getHighlighter({
				themes: [theme],
				langs
			});
			await highlighter.loadLanguage(...langs);
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
			return `{@html \`${html}\` }`;
		}
	},
	remarkPlugins: [remarkUnwrapImages],
	rehypePlugins: [
		[rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] }],
		rehypeSlug,
		rehypeToc
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		prerender: {
			// handleHttpError: 'warn'
		},
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		})
	}
};

export default config;
