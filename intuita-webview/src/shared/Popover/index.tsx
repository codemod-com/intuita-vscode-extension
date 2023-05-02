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
			arrow
			trigger={trigger}
			position={['top left', 'right center']}
			lockScroll
			on={['hover', 'focus']}
			contentStyle={{ display: 'flex', alignItems: 'center' }}
			{...others}
		>
			<span>{popoverText}</span>
		</Popup>
	);
};

export default Popover;
