import { useSession, signIn, signOut } from 'next-auth/react'

import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

const LoginButton = () => {
	const session = useSession()

	if (session.status === 'authenticated') {
		return (
			<button
				onClick={() =>
					signOut({
						callbackUrl: 'http://localhost:3000/landing',
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
					callbackUrl: 'http://localhost:3000',
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
