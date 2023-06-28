import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';

type Props = Readonly<
	{
		popoverText: string;
	} & Omit<PopupProps, 'children'>
>;

const Popover = ({ trigger, popoverText, contentStyle, ...others }: Props) => {
	if (!popoverText) {
		return null;
	}

	return (
		<Popup
			arrow
			mouseEnterDelay={300} // 100ms by default; Ref: https://react-popup.elazizi.com/component-api#mouseleavedelay
			mouseLeaveDelay={10} // 100ms by default; Ref: https://react-popup.elazizi.com/component-api#mouseleavedelay
			closeOnDocumentClick
			trigger={trigger}
			position={[
				'bottom left',
				'bottom right',
				'top left',
				'top right',
				'right center',
			]}
			lockScroll
			on={['hover', 'focus']}
			contentStyle={{
				display: 'flex',
				alignItems: 'center',
				padding: '8px',
				...contentStyle,
			}}
			{...others}
		>
			<span>{popoverText}</span>
		</Popup>
	);
};

export default Popover;
