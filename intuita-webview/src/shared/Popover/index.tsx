import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';

type Props = Readonly<
	{
		popoverText: string;
	} & Omit<PopupProps, 'children'>
>;

const Popover = ({ trigger, popoverText, ...others }: Props) => {
	if (!popoverText) {
		return null;
	}

	return (
		<Popup
			trigger={trigger}
			position={['top left', 'right center']}
			lockScroll
			on={['hover', 'focus']}
			{...others}
		>
			<div>{popoverText}</div>
		</Popup>
	);
};

export default Popover;
