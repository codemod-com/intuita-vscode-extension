/* eslint-disable jsx-a11y/anchor-is-valid */
import { CommitChangesFormData } from '../../../../src/components/webview/webviewEvents';
import Tree from '../../shared/Tree';
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	formData: CommitChangesFormData;
	setFormData(data: CommitChangesFormData): void;
};

const ChangesList = ({ formData, setFormData }: Props) => {
	const { stagedJobs } = formData;

	const handleUnapplyJob = (id: string) => {
		setFormData({
			...formData,
			stagedJobs: formData.stagedJobs.filter(
				(stagedJob) => stagedJob.hash !== id,
			),
		});
	};

	return (
		<Tree
			index={0}
			renderItem={({ node, open, setIsOpen, depth }) => {
				return (
					<li
						className={styles.listItem}
						key={node.id}
						onClick={() => setIsOpen(!open)}
					>
						<div
							style={{
								minWidth: depth * 5 + 'px',
							}}
						/>
						{node.children?.length !== 0 ? (
							<div className={styles.codicon}>
								<span
									className={cn('codicon', {
										'codicon-chevron-right': !open,
										'codicon-chevron-down': open,
									})}
								/>
							</div>
						) : null}
						<span className={styles.listItemLabel}>
							{node.label}
						</span>
						{depth !== 0 ? (
							<a
								role="button"
								className={styles.linkButton}
								onClick={() => handleUnapplyJob(node.id)}
							>
								Unapply
							</a>
						) : null}
					</li>
				);
			}}
			depth={0}
			node={{
				id: '',
				kind: '',
				label: 'Changes',
				children: stagedJobs.map(({ hash, label }) => ({
					id: hash,
					kind: '',
					label,
					children: [],
				})),
			}}
		/>
	);
};

export default ChangesList;
