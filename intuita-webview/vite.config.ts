/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

const target = process.env.TARGET_APP ?? '';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
		},
	},
	build: {
		outDir: `build/${target}`,
		rollupOptions: {
			input: {
				[target]: fileURLToPath(
					new URL(`./src/${target}/index.html`, import.meta.url),
				),
			},
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
	define: {
		'process.env': {},
	},
	plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
});
