import { useEffect, useRef, useState } from 'react';
import ProgressBar from './ProgressBar';

const InfiniteProgress = () => {
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setProgress((prevProgress) => (prevProgress + 25) % 125);
		}, 400);

		return () => {
			if (intervalRef.current === null) {
				return;
			}

			clearInterval(intervalRef.current);
			intervalRef.current = null;
		};
	}, []);

	return <ProgressBar progress={progress} />;
};

export default InfiniteProgress;
