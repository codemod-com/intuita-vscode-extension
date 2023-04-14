import React from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import '../shared/index.css';
import App from './App';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);

loader.config({ monaco });
loader.init();

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
