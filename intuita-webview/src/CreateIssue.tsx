import { VSCodeButton, VSCodeTextArea, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { useState } from 'react';
import { vscode } from './utilities/vscode';

const CreateIssue = () => {
  const [title, setTitle] = useState('Issue title');
  const [body, setBody] = useState('Issue body');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    vscode.postMessage({
      command: "submitIssue",
      title, 
      body, 
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column'}}>
      {/* @ts-ignore */}
      <VSCodeTextField value={title} onInput={(e) => setTitle(e.target.value)}>
          Issue Title
      </VSCodeTextField>
      {/* @ts-ignore */}
      <VSCodeTextArea labels={['Issue body']} value={body} onInput={(e) => setBody(e.target.value)}> 
        Issue Body
      </VSCodeTextArea>
      <VSCodeButton type='submit'>Create Issue</VSCodeButton>
    </form>
  )
}

export default CreateIssue;