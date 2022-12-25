import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

const ProfileCardOrg: NextPage = () => {
	const { organization } = useTimetableStore()

	const [inviteEmail, setInviteEmail] = useState('')
	const [organizationName, setOrganizationName] = useState('')

	if (!organization) {
		return (
			<div className="bg-base-100 rounded-xl p-6 mt-2 duration-300 ease-in-out transition-opacity">
				<div>
					<img
						src="https://static.vecteezy.com/system/resources/thumbnails/001/500/616/small/building-icon-free-vector.jpg"
						className="rounded-full h-24 w-24 inline table m-auto"
					/>
					<div className="ml-4 inline text-center">
						<h1 className="text-3xl text-white text whitespace-nowrap ">
							No organization
						</h1>
						<h2 className="whitespace-nowrap">
							You are not a member of an organization
						</h2>
					</div>
				</div>
				<div className="table m-auto text-center mt-5">
					<input
						type="text"
						placeholder="Organization name"
						value={organizationName}
						onChange={(e) =>
							setOrganizationName(e.target.value)
						}
						className="input input-bordered input-primary w-8/12 max-w-xs mr-2"
					/>
					<button className="btn btn-outline btn-success w-3/12 min-h-full">
						Create
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-base-100 rounded-xl p-6 mt-2 duration-300 ease-in-out transition-opacity">
			<div>
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
				<div className="table m-auto text-center mt-5">
					<input
						type="text"
						placeholder="email@gmail.com"
						value={inviteEmail}
						onChange={(e) => setInviteEmail(e.target.value)}
						className="input input-bordered input-primary w-8/12 max-w-xs mr-2"
					/>
					<button className="btn btn-outline btn-success w-3/12 min-h-full">
						Invite
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileCardOrg
