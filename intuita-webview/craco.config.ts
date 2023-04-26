import fs from 'fs';
import path from 'path';
import type { Configuration, WebpackPluginInstance } from 'webpack';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
	path.resolve(appDirectory, relativePath);

module.exports = {
	webpack: {
		configure: (
			config: Configuration,
			{ env }: { env: 'production' | 'development' },
		) => {
			if (env === 'production') {
				if (!config.optimization) {
					config.optimization = {};
				}

				config.optimization.splitChunks = {
					cacheGroups: {
						default: false,
					},
				};

				// Disable code chunks
				config.optimization.runtimeChunk = false;

				if (config.output) {
					// Rename main.{hash}.js to main.js
					config.output.filename = 'static/js/[name].js';
				}

				if (config.plugins) {
					const cssPlugin = config
						.plugins[5] as WebpackPluginInstance;
					// Rename main.{hash}.css to main.css
					cssPlugin.options.filename = 'static/css/[name].css';
					cssPlugin.options.moduleFilename = () =>
						'static/css/main.css';

					config.plugins.splice(6, 1);
				}

				config.entry = {
					sourceControl: resolveApp('src/sourceControl/index.tsx'),
					campaignManager: resolveApp(
						'src/campaignManager/index.tsx',
					),
					fileExplorer: resolveApp('src/fileExplorer/index.tsx'),
					jobDiffView: resolveApp('src/jobDiffView/index.tsx'),
					codemodList: resolveApp('src/codemodList/index.tsx'),
				};
			} else if (env === 'development') {
				const targetApp = process.env.TARGET_APP;
				console.info(`Starting ${targetApp} app ...`);
				config.entry = resolveApp(`src/${targetApp}/index.tsx`);
			}
			return config;
		},
	},
};
