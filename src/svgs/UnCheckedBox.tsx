import React from "react";

export default function UnCheckedBox<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<rect width={50} height={50} fill="url(#pattern0)" />
			<defs>
				<pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
					<use xlinkHref="#image0" transform="scale(0.02)" />
				</pattern>
				<image id="image0" width={50} height={50} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAA8klEQVRoge2ZzQnCQBBGn6Jl+NNHkCRleNBOROsQFPRiG4JYiFiGoB6CoIu7xA0xE/gezGFgknyP3VMGhBCiTXRKzOTADBjUnMXHFdgDxyovWQEPI7WMlcgNhHcr9YXtBkTmv3n/BW+mXuChodMfqHhPI8iA6Vs/9g2GRNzTOgPrCqFi6PMp4r1BoavVKiRiDYlYQyLWkIg1JGINiVhDItaQiDUkYg2JWEMi1pCINSRijdC/37vTJ8CtxizfSJzezVSKLc3vQ9zaxIhkBoK7NYkRgWLd1XT4Vy1CQcssQ1OKZeioxGwdXIAdcGro+0IIUQNPs7jB8hlJ65kAAAAASUVORK5CYII=" />
			</defs>
		</svg>

	)
}