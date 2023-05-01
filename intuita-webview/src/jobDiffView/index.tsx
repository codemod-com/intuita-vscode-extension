import React from 'react';
import ReactDOM from 'react-dom/client';
import '../shared/index.css';
import App from './App';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

loader.config({
	monaco,
});

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
