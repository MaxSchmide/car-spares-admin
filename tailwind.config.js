/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			mobile: { min: "320px", max: "480px" },
			tablet: { max: "768px" },
			laptop: { min: "769px", max: "1024px" },
		},
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
			animation: {
				wiggle: "wiggle .2s infinite",
				"zoom-in": "zoomIn .2s ease-in-out ",
			},
			keyframes: {
				wiggle: {
					"0%": {
						transform: "rotate(3deg)",
					},
					"50%": {
						transform: " rotate(0deg)",
					},
					"100%": {
						transform: "rotate(3deg)",
					},
				},
				zoomIn: {
					"0%": {
						transform: "scale(0)",
					},
					"100%": {
						transform: "scale(1)",
					},
				},
			},
		},
	},
	plugins: [],
}
