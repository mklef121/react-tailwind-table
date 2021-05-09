import React from "react";
export default function IndeterminateCheckBox<T extends Record<string, any>>(props?: T) {
	return (
		<svg  {...props} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<rect width={50} height={50} fill="url(#pattern0)" />
			<defs>
				<pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
					<use xlinkHref="#image0" transform="scale(0.02)" />
				</pattern>
				<image id="image0" width={50} height={50} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABMElEQVRoge2ZQUoDQRBFnxIRvIOJ9wiS5BguzCpLryB6CN2ICrrQawjiQSR3CISAcZEEYpNux+q0Uxn+g1o0dM38x9QMAw1CCLFL7FXYMwDOgePCWWKMgWfgLeci18DcSV1ZJQYOwofVi4XdT4gM/+b9L0QztRJN7WD9SuacGugDZ2vrk9jGlEj4tD6Au4xQFg74KRKdoNRo7RQS8YZEvCERb0jEG40RSf2i/MYhcLStIEsmwNTSmCMyAm4y+jdxAdxaGhszWhLxRs47cg+8bCvIkom1MUdkivELU4LGjJZEvCERb0jEGxLxRmNEUr8oX8G6C8wKZtlEN1iHmSrxSP3nIWE9WET6DoKHdWoRgcVxV93hV3WZClrlMLTH4jC0U2FvCT6BJ+C9pvsLIUQBvgGQKsodQE+KFgAAAABJRU5ErkJggg==" />
			</defs>
		</svg>

	)
}