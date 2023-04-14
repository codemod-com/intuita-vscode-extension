import { Monaco } from '@monaco-editor/react';

const ignoreCodes = [
	2304, // unresolved vars
	2451, // redeclared block scope vars
	2552, // undef
];

const configure = (m: Monaco) => {
	m.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
		diagnosticCodesToIgnore: ignoreCodes,
	});
};

export default configure;
