import type { NextPage } from 'next'

interface ProfileCardUserProps {
	name: string
	email: string
	image: string
}

const ProfileCardUser: NextPage<ProfileCardUserProps> = ({
	name,
	email,
	image,
}) => {
	return (
		<div className="bg-base-100 rounded-xl p-6 duration-300 ease-in-out transition-opacity">
			<div>
				<img
					src={image}
					className="rounded-full h-24 w-24 inline table m-auto"
				/>
				<div className="ml-4 inline text-center">
					<h1 className="text-3xl text-white whitespace-nowrap">
						{name}
					</h1>
					<h2 className="whitespace-nowrap">{email}</h2>
				</div>
			</div>
		</div>
	)
}

export default ProfileCardUser
