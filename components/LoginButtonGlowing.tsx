import { useSession, signIn } from 'next-auth/react'

import { FaSignInAlt } from 'react-icons/fa'

const LoginButtonGlowing = () => {
	const session = useSession()

	const WEB_URL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000/'
			: 'https://timetable-manager.vercel.app'

	return (
		<button
			onClick={() =>
				signIn('google', {
					callbackUrl: WEB_URL + '/bindings',
				})
			}
		>
			<div className="relative group">
				<div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-[#6419e6] to-[#9333ea] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
				<button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
					<span className="flex items-center gap-2 text-white">
						<FaSignInAlt />
						Sign In
					</span>
				</button>
			</div>
		</button>
	)
}

export default LoginButtonGlowing
