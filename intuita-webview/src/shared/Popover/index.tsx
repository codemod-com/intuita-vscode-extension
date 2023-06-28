import Tippy from '@tippyjs/react';

type Props = {
	trigger: React.ReactNode;
	popoverText: string;
	mouseEnterDelay?: number;
	disabled?: boolean;
	// @TODO
	position?: ReadonlyArray<string>;
	contentStyle?: object;
};

const Popover = ({
	trigger,
	popoverText,
	mouseEnterDelay = 200,
	disabled = false,
}: Props) => {
	return (
		<Tippy
			arrow
			delay={mouseEnterDelay}
			content={popoverText}
			placement="auto"
			disabled={disabled}
		>
			<span>{trigger}</span>
		</Tippy>
	);
};

export default Popover;
