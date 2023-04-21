// Ref: https://lospec.com/palette-list/anarkis-27
// 26 colors
const COLOR_PALETTE: string[] = [
	'#7b133e',
	'#653333',
	'#562f8d',
	'#1b4a36',
	'#27436c',
	'#2f3f8d',
	'#423f5f',
	'#4a3f3d',
	'#e62d99',
	'#e04141',
	'#c8541c',
	'#008d52',
	'#008a8a',
	'#b55e41',
	'#ac661f',
	'#b35dc5',
	'#3284be',
	'#847a6e',
	'#727d8d',
	'#edb000',
	'#7ed12c',
	'#61cece',
	'#ffa87c',
	'#f9a6c8',
	'#bebeb1',
	'#ffffff',
];

// Ref: https://stackoverflow.com/a/7616484
export const buildHash = (data: string): string => {
	if (data === '') {
		return '';
	}
	let hash = 0;
	for (let i = 0; i < data.length; i++) {
		const char = data.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash.toString();
};

export const generateColor = (hash: string): string => {
	const colorHex =
		COLOR_PALETTE[parseInt(hash) % COLOR_PALETTE.length] ?? '#7b133e';
	return colorHex;
};
