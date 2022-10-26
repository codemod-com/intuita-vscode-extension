import { destructIntuitaFileSystemUri } from '../destructIntuitaFileSystemUri';
import { assert } from 'chai';

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
