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

	it('destructIntuitaFileSystemUri', () => {
		// cspell:disable-next-line
		const jobHash = 'nBGFpcXp_FRhKAiXfuj1SLIljTE';

		const d = destructIntuitaFileSystemUri({
			scheme: 'intuita',
			fsPath: `/vfs/jobs/file/a/b/c/index.ts/proposedChange_${jobHash}.ts`,
		});

		assert.equal(d.directory, 'jobs');
		assert.equal(d.scheme, 'file');
		assert.equal(d.fsPath, '/a/b/c/index.ts');
		assert.equal(d.jobHash, jobHash);
	});
});
