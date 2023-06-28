import React, { useRef, useState } from 'react';
import s from './style.module.css';

type Props = {
	delayBeforeShow: number;
	children: React.ReactNode;
	text: string;
};

const OFFSET_X = 14;
const OFFSET_Y = -24;

const Tooltip = ({ children, text, delayBeforeShow }: Props) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const maxHeight = document.body.clientHeight;
	const maxWidth = document.body.clientWidth;

	const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
		timerRef.current = setTimeout(() => {
			if (tooltipRef.current === null) {
				return;
			}

			let { left: x, top: y } = (
				e.target as HTMLDivElement
			).getBoundingClientRect();

			const { width: tipWidth, height: tipHeight } =
				tooltipRef.current?.getBoundingClientRect();

			if (x + tipWidth + OFFSET_X >= maxWidth) {
				x = maxWidth - tipWidth - OFFSET_X;
			}
			if (y + tipHeight + OFFSET_Y >= maxHeight) {
				y = maxHeight - tipHeight - OFFSET_Y - 10;
			}

			setPosition({ x, y });
			setVisible(true);
		}, delayBeforeShow);
	};

	const handleMouseOut = () => {
		setVisible(false);

		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
		}
	};

	const { x, y } = position;

	return (
		<>
			<div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
				{children}
			</div>
			<span
				ref={tooltipRef}
				className={s.tooltip}
				style={{
					visibility: visible ? 'visible' : 'hidden',
					left: x + OFFSET_X + 'px',
					top: y + OFFSET_Y + 'px',
					maxWidth,
				}}
			>
				{text}
			</span>
		</>
	);
};

export default Tooltip;
