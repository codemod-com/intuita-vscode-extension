#!/usr/bin/env node

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');
const fs = require('fs');
const path = require('path');

// Disable code splitting
config.optimization.splitChunks = {
	cacheGroups: {
		default: false,
	},
};

// Disable code chunks
config.optimization.runtimeChunk = false;

// Rename main.{hash}.js to main.js
config.output.filename = 'static/js/[name].js';

// Rename main.{hash}.css to main.css
config.plugins[5].options.filename = 'static/css/[name].css';
config.plugins[5].options.moduleFilename = () => 'static/css/main.css';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

// @TODO fix ManifestPlugin so it dont break build with custom entrypoints
// as quick fix just removed it
config.plugins.splice(6, 1);

config.entry = {
	sourceControl: resolveApp('src/sourceControl/index.tsx'),
	main: resolveApp('src/main/index.tsx'),
};
