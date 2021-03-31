import React from "react";

export default function DashSvg<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fillRule="evenodd" clipRule="evenodd" d="M0 6.48215H6.79688V0.857147H0V6.48215ZM5.85938 5.5H0.9375V1.75H5.85938V5.5ZM6.79688 15.5223H0V7.55357H6.79688V15.5223ZM5.85938 14.5402H0.9375V8.44643H5.85938V14.5402ZM15 8.8259H8.20312V0.857147H15V8.8259ZM14.0625 7.84375H9.14062V1.75H14.0625V7.84375ZM15 15.4107H8.20312V9.78571H15V15.4107ZM14.0625 14.4286H9.14062V10.6786H14.0625V14.4286Z" />
		</svg>
	)
}