import { useSession, signIn, signOut } from 'next-auth/react'

import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'

const LoginButton = () => {
	const session = useSession()

	if (session.status === 'authenticated') {
		console.log(session.data?.user?.name)
		return (
			<>
				<button onClick={() => signOut()} className="btn gap-2">
					<FaSignOutAlt />
					Sign Out
				</button>
			</>
		)
	}
	return (
		<>
			<button onClick={() => signIn()} className="btn gap-2">
				<FaSignInAlt />
				Sign In
			</button>
		</>
	)
}

export default LoginButton
