import { useSession, signIn, signOut } from 'next-auth/react'

import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

const LoginButton = () => {
	const session = useSession()

	if (session.status === 'authenticated') {
		return (
			<>
				<button
					onClick={() =>
						signOut({
							callbackUrl: 'http://localhost:3000/landing',
						})
					}
					className="cursor-pointer flex items-center text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
				>
					<FaSignOutAlt className="w-fit h-full bg-neutral transition duration-75 mr-1" />
					Sign Out
				</button>
			</>
		)
	}
	return (
		<>
			<button
				onClick={() =>
					signIn('google', {
						callbackUrl: 'http://localhost:3000',
					})
				}
				className="cursor-pointer flex items-center text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
			>
				<FaSignInAlt className="w-fit h-full bg-neutral transition duration-75 mr-1" />
				Sign In
			</button>
		</>
	)
}

export default LoginButton
