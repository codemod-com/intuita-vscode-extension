import { assert } from 'chai';
import { destructIntuitaFileSystemUri } from '../src/destructIntuitaFileSystemUri';

describe('destructIntuitaFileSystemUri', () => {
	it('destructIntuitaFileSystemUri', () => {
		const d = destructIntuitaFileSystemUri({
			scheme: 'intuita',
			fsPath: '/vfs/files/file/a/b/c/index.ts',
		});

		assert.equal(d.directory, 'files');
		assert.equal(d.scheme, 'file');
		assert.equal(d.fsPath, '/a/b/c/index.ts');
	});
});
