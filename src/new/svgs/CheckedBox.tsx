import React from "react";
export default function CheckedBox<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fillRule="evenodd" clipRule="evenodd" d="M4.9 7.1L3.5 8.5 8 13 18 3l-1.4-1.4L8 10.2 4.9 7.1zM16 16H2V2h10V0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8h-2v8z" />
		</svg>

	)
}