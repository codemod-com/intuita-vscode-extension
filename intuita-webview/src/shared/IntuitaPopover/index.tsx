import Tippy, { TippyProps } from '@tippyjs/react';

type Props = TippyProps;

const IntuitaPopover = ({ delay = [800, 100], ...others }: Props) => {
	return <Tippy arrow delay={delay} placement="auto" {...others} />;
};

export default IntuitaPopover;
