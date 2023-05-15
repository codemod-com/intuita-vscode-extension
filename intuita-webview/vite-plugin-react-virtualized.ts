import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

const faultyImport = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

export default function reactVirtualized(): Plugin {
	return {
		name: 'flat:react-virtualized',
		configResolved() {
			const file = require
				.resolve('react-virtualized')
				.replace(
					path.join('dist', 'commonjs', 'index.js'),
					path.join(
						'dist',
						'es',
						'WindowScroller',
						'utils',
						'onScroll.js',
					),
				);
			const code = fs.readFileSync(file, 'utf-8');
			const modified = code.replace(faultyImport, '');
			fs.writeFileSync(file, modified);
		},
	};
}
