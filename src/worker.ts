import { parentPort } from 'node:worker_threads';

import { ConsoleKind } from './data/schemata/consoleKind';
import { WorkerThreadMessage } from './data/schemata/workerThreadMessage';
import { decodeMainThreadMessage } from './data/schemata/mainThreadMessage';

class PathAwareError extends Error {
	constructor(public readonly path: string, message?: string | undefined) {
		super(message);
	}
}

const sendLog = (consoleKind: ConsoleKind, message: string): void => {
	parentPort?.postMessage({
		kind: 'console',
		consoleKind,
		message,
	} satisfies WorkerThreadMessage);
};

const messageHandler = async (m: unknown) => {
	console.log('MESSAGE', m);

	parentPort?.postMessage({
		kind: 'test',
	});

	try {
		const message = decodeMainThreadMessage(m);

		if (message.kind === 'exit') {
			parentPort?.off('message', messageHandler);
			return;
		}

		sendLog('log', `Received message: ${JSON.stringify(message)}`);
	} catch (error) {
		parentPort?.postMessage({
			kind: 'error',
			message: error instanceof Error ? error.message : String(error),
			path: error instanceof PathAwareError ? error.path : undefined,
		} satisfies WorkerThreadMessage);
	}
};

export const executeWorkerThread = () => {
	console.log(Boolean(parentPort));
	parentPort?.on('message', messageHandler);
};
