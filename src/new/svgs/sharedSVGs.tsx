import React from "react";
export function BackButton<T extends Record<string, any>>(props?: T) {
    return (
        <svg {...props} width={39} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M.94 13.06a1.5 1.5 0 010-2.12l9.545-9.547a1.5 1.5 0 112.121 2.122L4.121 12l8.485 8.485a1.5 1.5 0 11-2.12 2.122L.938 13.06zm37.074.44H2v-3h36.014v3z"  />
        </svg>
    )
}