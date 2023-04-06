import { ReactNode } from "react";
import styles from './style.module.css';

type Props = {
  id: string;
  label: string;
  icon: ReactNode;
  actionButtons: ReactNode;
  onClick(): void;
}

const TreeItem = ({ id, onClick, label, icon, actionButtons}: Props) => {
  return (
  <div
    id={id}
    className={styles.root}
    onClick={onClick}
  >
    <div className={styles.icon}>{
      icon
    }</div>
   
    {label}
    <div className={styles.actions}>{actionButtons}</div>
  </div>
  )
}

export default TreeItem;