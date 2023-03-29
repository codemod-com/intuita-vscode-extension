import { VSCodeButton, VSCodeTextArea, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { useState } from 'react';
import { vscode } from '../utilities/vscode';
import styles from './style.module.css';

const CreateIssue = () => {
  const [title, setTitle] = useState('Issue title');
  const [body, setBody] = useState('Issue body');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    vscode.postMessage({
      command: "intuita.sourceControl.submitIssue",
      title, 
      body, 
    });
  }

  return (
    <div className={styles.root}>
    <h1 className={styles.header}>Create an Issue</h1>
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* @ts-ignore */}
      <VSCodeTextField value={title} onInput={(e) => setTitle(e.target.value)}>
         Title
      </VSCodeTextField>
      {/* @ts-ignore */}
      <VSCodeTextArea labels={['Issue body']} value={body} onInput={(e) => setBody(e.target.value)}> 
        Description
      </VSCodeTextArea>
      <VSCodeButton type='submit'>Create Issue</VSCodeButton>
    </form>
    </div>
  )
}

export default CreateIssue;