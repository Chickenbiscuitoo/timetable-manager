import { useSession, signIn, signOut } from 'next-auth/react'

import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

const LoginButton = () => {
	const session = useSession()

	const WEB_URL =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000/'
			: 'https://timetable-manager.vercel.app'

	if (session.status === 'authenticated') {
		return (
			<button
				onClick={() =>
					signOut({
						callbackUrl: WEB_URL + '/landing',
					})
				}
				className="btn gap-2"
			>
				<FaSignOutAlt />
				Sign Out
			</button>
		)
	}
	return (
		<button
			onClick={() =>
				signIn('google', {
					callbackUrl: WEB_URL,
				})
			}
			className="btn gap-2"
		>
			<FaSignInAlt />
			Sign In
		</button>
	)
}

export default LoginButton
