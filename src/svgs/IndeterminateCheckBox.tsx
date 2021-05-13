import React from "react";
export default function IndeterminateCheckBox<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			<path d="M160.48 0h32v32h-32zM224.48 0h32v32h-32z"/>
			<path d="M432 0H288.464v32H432c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48H80c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h48.464V0H80C35.839.053.053 35.839 0 80v352c.053 44.161 35.839 79.947 80 80h352c44.161-.053 79.947-35.839 80-80V80c-.053-44.161-35.839-79.947-80-80z"/>
			<path d="M128 240h256v32H128z"/>
		</svg>
	)
}