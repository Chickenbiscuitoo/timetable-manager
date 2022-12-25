import type { NextPage } from 'next'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import ProfileCardUser from './ProfileCardUser'
import ProfileCardOrg from './ProfileCardOrg'

const ProfileCard: NextPage = () => {
	const router = useRouter()
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/landing')
		},
	})

	const name = session?.user?.name || 'User'
	const email = session?.user?.email || 'user@email.com'
	const image =
		session?.user?.image ||
		'https://upload.wikimedia.org/wikipedia/commons/2/21/Danny_DeVito_by_Gage_Skidmore.jpg'

	return (
		<div className="absolute z-20 bg-primary p-4 rounded-xl shadow-xl duration-300 ease-in-out transition-opacity">
			<ProfileCardUser name={name} email={email} image={image} />
			<ProfileCardOrg />
		</div>
	)
}

export default ProfileCard
