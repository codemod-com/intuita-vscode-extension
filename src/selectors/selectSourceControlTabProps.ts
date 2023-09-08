import { createBeforeAfterSnippets } from '../components/webview/IntuitaPanelProvider';
import type { RootState } from '../data';

const buildIssueTemplateInHTML = (
	codemodName: string,
	before: string | null,
	after: string | null,
	expected: string | null,
): string => {
	return `
		<hr>
		<p>
		<span style="font-size: 18px; font-weight: bold; color: #FFA500;">⚠️⚠️ Please do not include any proprietary code in the issue. ⚠️⚠️</span>
		</p>
		<hr>
		<h3>Codemod: ${codemodName}</h3>
		<p><strong>1. Code before transformation (Input for codemod)</strong></p>
		<pre><code>${before ?? '// paste code here'}</code></pre>
		<p><strong>2. Expected code after transformation (Desired output of codemod)</strong></p>
		<pre><code>${expected ?? '// paste code here'}</code></pre>
		<p><strong>3. Faulty code obtained after running the current version of the codemod (Actual output of codemod)</strong></p>
		<pre><code>${after ?? '// paste code here'}</code></pre>
		<h3>Additional context</h3>
	`;
};

type SourceControlTabProps = Readonly<{
	title: string;
	body: string;
}>;

export const selectSourceControlTabProps = (
	state: RootState,
): SourceControlTabProps | null => {
	if (!state.jobDiffView.visible) {
		return null;
	}
	if (state.sourceControl.kind === 'IDLENESS') {
		return null;
	}

	if (state.sourceControl.kind === 'ISSUE_CREATION_WAITING_FOR_AUTH') {
		return {
			title: state.sourceControl.title,
			body: state.sourceControl.body,
		};
	}

	const job = state.job.entities[state.sourceControl.jobHash] ?? null;

	if (job === null) {
		throw new Error('Unable to get the job');
	}

	const { beforeSnippet, afterSnippet } = createBeforeAfterSnippets(
		state.sourceControl.oldFileContent,
		state.sourceControl.newFileContent,
	);

	const body = buildIssueTemplateInHTML(
		job.codemodName,
		beforeSnippet,
		afterSnippet,
		null,
	);

	const title = `[Codemod:${job.codemodName}] Invalid codemod output`;

	return {
		title,
		body,
	};
};
