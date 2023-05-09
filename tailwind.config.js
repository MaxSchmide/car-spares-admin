/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#111827",
				primaryTint: "#202735",
				secondary: "#4940e5",
				secondaryTint: "#928cef",
				secondaryShade: "#2c2689",
				grey1: "#e4e6eb",
				grey2: "#C0C4CE",
			},
			pointerEvents: {
				all: "all",
			},
		},
	},
	plugins: [],
}
