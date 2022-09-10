/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
	},
	// add daisyUI plugin
	plugins: [require('daisyui')],

	// daisyUI config (optional)
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#1f2937',

					secondary: '#E1E5F2',

					accent: '#598392',

					neutral: '#1D282F',

					'base-100': '#EFF0F6',

					info: '#68D8EE',

					success: '#24A372',

					warning: '#F6C73C',

					error: '#F85966',
				},
			},
		],
	},
}
