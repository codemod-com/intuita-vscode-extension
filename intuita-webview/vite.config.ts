/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import css from 'rollup-plugin-css-chunks';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: "build",
		rollupOptions: {
			input: {
				sourceControl: fileURLToPath(new URL('./src/sourceControl/index.html', import.meta.url)),
				main: fileURLToPath(new URL('./src/main/index.html', import.meta.url)),
				codemodList: fileURLToPath(new URL('./src/codemodList/index.html', import.meta.url)),
				jobDiffView: fileURLToPath(new URL('./src/jobDiffView/index.html', import.meta.url)),
			},
			output: {
				entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
			}
		}
  },
	define: {
		'process.env': {},
	},
	plugins: [
		react(),
		viteTsconfigPaths(),
		svgrPlugin(),
			css({
					// inject a CSS `@import` directive for each chunk depended on
					injectImports: false,
					// name pattern for emitted secondary chunks
					chunkFileNames: '[name].chunk.css',
					// name pattern for emitted entry chunks
					entryFileNames: '[name].css',
					// public base path of the files
					publicPath: '',
					// generate sourcemap
					sourcemap: false,
					// emit css/map files
					emitFiles: true,
			})
	],
});
