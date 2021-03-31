import React from "react";

export default function Minimize<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="12" height="1.94594" rx="0.972972" fill="#626262" />
			<rect y="5.02704" width="12" height="1.94594" rx="0.972972" fill="#626262" />
			<rect y="10.0541" width="12" height="1.94594" rx="0.972972" fill="#626262" />
		</svg>
	)
}