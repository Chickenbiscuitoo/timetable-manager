/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			height: {
				'10vh': '10vh',
				'20vh': '20vh',
				'30vh': '30vh',
				'40vh': '40vh',
				'50vh': '50vh',
				'60vh': '60vh',
				'70vh': '70vh',
				'80vh': '80vh',
				'90vh': '90vh',
				'100vh': '100vh',
			},
		},
	},
	// add daisyUI plugin
	plugins: [require('daisyui')],

	// daisyUI config (optional)
	daisyui: {
		themes: ['light', 'dark'],
	},
}
