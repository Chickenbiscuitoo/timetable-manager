import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

const ProfileCardOrg: NextPage = () => {
	const {
		organization,
		createOrganization,
		inviteMemberToOrganization,
		leaveOrganization,
	} = useTimetableStore()

	const [inviteEmail, setInviteEmail] = useState('')
	const [organizationName, setOrganizationName] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	const handleNameValidation = () => {
		if (organizationName.length < 3) {
			setErrorMessage(
				'Organization name must be at least 3 characters'
			)
		} else if (organizationName.length > 64) {
			setErrorMessage(
				'Organization name must be less than 64 characters'
			)
		} else {
			setErrorMessage('')
		}
	}

	const handleEmailValidation = () => {
		const emailRegex = new RegExp(
			'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
		)
		if (!emailRegex.test(inviteEmail) || inviteEmail.length < 3) {
			setErrorMessage('Email must be valid')
		} else {
			setErrorMessage('')
		}
	}

	const handleCreate = () => {
		if (!errorMessage && organizationName) {
			createOrganization(organizationName)
			setOrganizationName('')
		}
	}

	const handleInvite = () => {
		if (!errorMessage && organization && inviteEmail) {
			inviteMemberToOrganization(inviteEmail, organization.id)
			setInviteEmail('')
		}
	}

	const handleLeave = () => {
		if (organization) {
			leaveOrganization()
		}
	}

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
						onChange={(e) => {
							setOrganizationName(e.target.value.trim())
							handleNameValidation()
						}}
						className="input input-bordered input-primary w-8/12 max-w-xs mr-2"
					/>
					<button
						onClick={handleCreate}
						disabled={errorMessage ? true : false}
						className="btn btn-outline btn-success w-3/12 min-h-full"
					>
						Create
					</button>
					{errorMessage && (
						<p className="text-error mt-3">{errorMessage}</p>
					)}
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
					<button
						onClick={handleLeave}
						className="btn btn-xs btn-error btn-outline table m-auto mt-2"
					>
						Leave
					</button>
				</div>

				<div className="table m-auto text-center mt-5">
					<input
						type="text"
						placeholder="email@gmail.com"
						value={inviteEmail}
						onChange={(e) => {
							setInviteEmail(e.target.value.trim())
							handleEmailValidation()
						}}
						className="input input-bordered input-primary w-8/12 max-w-xs mr-2"
					/>
					<button
						onClick={handleInvite}
						disabled={errorMessage ? true : false}
						className="btn btn-outline btn-success w-3/12 min-h-full"
					>
						Invite
					</button>
					{errorMessage && (
						<p className="text-error mt-3">{errorMessage}</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfileCardOrg
