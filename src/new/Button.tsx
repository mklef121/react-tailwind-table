import React from "react";

interface buttonProps extends Record<string, any>{
	uppercase ?: boolean;
	text ?: string;
	px ?: string;
	py ?: string;
	children?:string;


}

export default function Button(props: buttonProps) {
	var myclass = `${props.uppercase ? 'uppercase':'' } ${props.px ? props.px:'px-5' }
							${props.py ? props.py:'py-2' } 
							appearance-none bg-brand-color text-white rounded`;
	if (props.className) myclass = myclass+ " "+props.className;

	const {uppercase,className, text, px, py, children, ...others} = props;
	
	return (
		<button className={myclass} {...others}>
			{props.children ? props.children : props.text}
		</button>
	)
}


Button.defaultProps = {
  uppercase: true
};