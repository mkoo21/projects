import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import IconResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';


export default defineConfig({
	plugins: [,
		sveltekit(),
	    Icons({ compiler: 'svelte' }),
		AutoImport({
			resolvers: [
				IconResolver(), // not working
			]}),
});
