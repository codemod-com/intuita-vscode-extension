import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import styles from './style.module.css';

const LoadingProgress = () => {
	return (
		<div className={styles.root}>
			<VSCodeProgressRing className={styles.progressRing} />
			<span>Executing codemod...</span>
		</div>
	);
};

export default LoadingProgress;
