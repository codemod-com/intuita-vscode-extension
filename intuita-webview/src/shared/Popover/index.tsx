import Tippy, { TippyProps } from '@tippyjs/react';

type Props = TippyProps;

const Popover = ({
	content,
	delay = 200,
	disabled = false,
	...others
}: Props) => {
	return (
		<Tippy
			arrow
			delay={delay}
			content={content}
			placement="auto"
			disabled={disabled}
			{...others}
		/>
	);
};

export default Popover;
