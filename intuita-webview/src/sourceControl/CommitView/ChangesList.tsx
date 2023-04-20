/* eslint-disable jsx-a11y/anchor-is-valid */
import { FormData } from ".";
import Tree from "../../shared/Tree";
import styles from './style.module.css';
import cn from 'classnames';

type Props = {
	formData: FormData;
	onChangeFormField: (
		fieldName: keyof FormData,
	) => (e: Event | React.FormEvent<HTMLElement>) => unknown;
};

const ChangesList = ({ formData, onChangeFormField }: Props) => {
  const { stagedJobs } = formData;

  const handleUnapplyJob = () => {
    console.log('unapply', onChangeFormField);
  }

  return (
    <Tree 
    renderItem={({ node, open, setIsOpen, depth }) => {
      return <li className={styles.listItem} key={node.id} onClick={() => setIsOpen(!open)}>
        <div
				style={{
					minWidth: depth * 5 + 'px'
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
       { node.label }
      </span>
          { depth !== 0 ? <a role='button' className={styles.linkButton} onClick={handleUnapplyJob}>Unapply</a>  : null}
       </li>
    }}
    depth={0}
    node={{
      id: '',
      kind: '',
      label: 'Changes', 
      children: stagedJobs.map(({ hash, label}) => ({
        id: hash, 
        kind: '',
        label,
        children: []
      }))
    }}
    />
  )
}

export default ChangesList