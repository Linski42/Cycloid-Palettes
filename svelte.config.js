import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { Poline } from 'poline'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
