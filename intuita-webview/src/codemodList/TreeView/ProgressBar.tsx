import { Line } from 'rc-progress';

type Props = {
	progress: number;
};

const ProgressBar = ({ progress }: Props) => {
	return (
		<div className="flex mb-2" style={{ height: '3.5px', width: '95%' }}>
			<Line
				percent={progress}
				strokeWidth={1.5}
				className="w-full"
				strokeLinecap="round"
				trailColor="var(--scrollbar-slider-background)"
				strokeColor="var(--vscode-progressBar-background)"
			/>
		</div>
	);
};

export default ProgressBar;
