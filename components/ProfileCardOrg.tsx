import type { NextPage } from 'next'

import useTimetableStore from '../store'

const ProfileCardOrg: NextPage = () => {
	const { organization } = useTimetableStore()

	return (
		<div className="bg-base-100 rounded-xl p-6 mt-2">
			<div className="">
				<img
					src="https://static.vecteezy.com/system/resources/thumbnails/001/500/616/small/building-icon-free-vector.jpg"
					className="rounded-full h-24 w-24 inline table m-auto"
				/>
				<div className="ml-4 inline text-center">
					<h1 className="text-3xl text-white text whitespace-nowrap ">
						{organization.name}
					</h1>
					<h2 className="whitespace-nowrap">
						{organization.members} members
					</h2>
				</div>
			</div>
		</div>
	)
}

export default ProfileCardOrg
