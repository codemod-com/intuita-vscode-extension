export function detectBaseTheme(): 'vs-light' | 'vs-dark' {
	const body = document.body;
	if (body) {
		switch (body.getAttribute('data-vscode-theme-kind')) {
			default:
			case 'vscode-light':
				return 'vs-light';
			case 'vscode-dark':
			case 'vscode-high-contrast':
				return 'vs-dark';
		}
	}

	return 'vs-light';
}
