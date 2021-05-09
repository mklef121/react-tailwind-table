import React from "react";

interface buttonProps extends Record<string, any>{
	uppercase ?: boolean;
	text ?: string;
	px ?: string;
	py ?: string;
	children?:string;
	bg_color: string
}

export default function Button(props: buttonProps) {
	const {uppercase,className, text, px, py, children,bg_color, ...others} = props;
	var myclass = `${uppercase ? 'uppercase ':' ' } ${px ? px:'px-5'} ${px ? px:'px-5'} ${py ? py:'py-2'}
				   ${bg_color} 
				    appearance-none text-white rounded`;
	if (props.className) myclass = myclass+ " "+props.className;

	
	
	return (
		<button className={myclass} {...others}>
			{props.children ? props.children : props.text}
		</button>
	)
}


Button.defaultProps = {
  uppercase: true
};