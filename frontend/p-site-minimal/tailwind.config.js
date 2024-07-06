/** @type {import('tailwindcss').Config} */
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}',
  		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
  ],
  theme: {
    extend: {},
  },
  plugins: [ 
    skeleton({
      themes: { preset: [ "crimson" ] }
    }),
   ],
}

