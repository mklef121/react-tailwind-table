import React from "react";

export default function UnCheckedBox<T extends Record<string, any>>(props?: T) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.381 15.381">
			<path d="M12.016 15.381h-8.65A2.83 2.83 0 01.54 12.556v-9.73A2.83 2.83 0 013.366 0h8.65a2.829 2.829 0 012.825 2.826v9.73a2.828 2.828 0 01-2.825 2.825zM3.366 1.305c-.839 0-1.521.683-1.521 1.521v9.73c0 .838.683 1.521 1.521 1.521h8.65c.839 0 1.521-.684 1.521-1.521v-9.73c0-.839-.683-1.521-1.521-1.521h-8.65z" 
			/>
		</svg> 
	)
}

