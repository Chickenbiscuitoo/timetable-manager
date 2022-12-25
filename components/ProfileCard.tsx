import type { NextPage } from 'next'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

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
		<div className="absolute z-20 bg-primary p-4 rounded-xl">
			<div className="bg-base-100 rounded-xl p-6 mb-2">
				<div>
					<img
						src={image}
						className="rounded-full h-24 w-24 inline"
					/>
					<div className="ml-4 inline">
						<h1 className="text-3xl text-white">{name}</h1>
						<h2>{email}</h2>
					</div>
				</div>
			</div>
			<div className="bg-base-100 rounded-xl p-6">
				<div>
					<img
						src={image}
						className="rounded-full h-24 w-24 inline"
					/>
					<div className="ml-4 inline">
						<h1 className="text-3xl text-white">{name}</h1>
						<h2>{email}</h2>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfileCard
