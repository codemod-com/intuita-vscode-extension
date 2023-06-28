/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
		},
	},
	build: {
		assetsInlineLimit: 10000,
	},
	define: {
		'process.env': {},
	},
	plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
});
