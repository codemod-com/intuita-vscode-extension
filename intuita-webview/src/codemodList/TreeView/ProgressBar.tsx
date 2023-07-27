import { Line } from 'rc-progress';

export const ProgressBar = (
	props: Readonly<{
		percent: number;
	}>,
) => (
	<div className="flex mb-2" style={{ height: '3.5px', width: '95%' }}>
		<Line
			percent={props.percent}
			strokeWidth={1.5}
			className="w-full"
			strokeLinecap="round"
			trailColor="var(--scrollbar-slider-background)"
			strokeColor="var(--vscode-progressBar-background)"
		/>
	</div>
);
