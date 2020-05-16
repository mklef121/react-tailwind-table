import React from 'react';

export default function ThreeDotsvg(props: { className ? : string }) {
	// the ?? was a new feauture introduced in typescript
	//https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing
    return (
    	<svg width="14" height="4" className={`${props.className ?? "" }`}  viewBox="0 0 14 4" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g opacity="0.4">
			<circle cx="2.19796" cy="1.80139" r="1.38611" fill="#222222"/>
			<circle cx="11.9013" cy="1.80115" r="1.38611" fill="#222222"/>
			<circle cx="7.04991" cy="1.80115" r="1.38611" fill="#222222"/>
			</g>
			</svg>

    	
    );
}