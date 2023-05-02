import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';

type Props = Readonly<
	{
		popoverText: string;
	} & PopupProps
>;

const Popover = ({ trigger, popoverText }: Props) => {
	if (!popoverText) {
		return null;
	}

	return (
		<Popup
			trigger={trigger}
			position={['top left', 'right center']}
			lockScroll
			on={['hover', 'focus']}
		>
			<div>{popoverText}</div>
		</Popup>
	);
};

export default Popover;
