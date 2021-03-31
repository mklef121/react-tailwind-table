import React from "react";

export default function EluziniLogo<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<ellipse cx="20.4826" cy="1.55556" rx="1.51724" ry="1.55556" fill="#CE5736" />
			<ellipse cx="20.4826" cy="7.00001" rx="1.51724" ry="1.55556" fill="#CE5736" />
			<ellipse cx="20.4826" cy="12.4445" rx="1.51724" ry="1.55556" fill="#CE5736" />
			<rect width="17.4483" height="3.11111" rx="1.55556" fill="#CE5736" />
			<rect x="6.06885" y="5.44446" width="11.3793" height="3.11111" rx="1.55556" fill="#CE5736" />
			<rect x="9.86182" y="10.8889" width="7.58621" height="3.11111" rx="1.55556" fill="#CE5736" />
		</svg>

	)
}