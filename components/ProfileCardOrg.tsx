import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

import { FaRegBuilding } from 'react-icons/fa'

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

	const handleNameValidation = (name: string) => {
		if (name.trim().length < 3) {
			setErrorMessage(
				'Organization name must be at least 3 characters'
			)
		} else if (name.trim().length > 64) {
			setErrorMessage(
				'Organization name must be less than 64 characters'
			)
		} else {
			setErrorMessage('')
		}
	}

	const handleEmailValidation = (email: string) => {
		const emailRegex = new RegExp(
			'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
		)
		if (!emailRegex.test(email.trim()) || email.trim().length < 3) {
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
			<div className="bg-base-100 shadow-lg rounded-xl p-6 mt-2 duration-300 ease-in-out transition-opacity">
				<div>
					<div className="rounded-full h-24 w-24 inline table m-auto">
						<FaRegBuilding className="h-full w-full m-auto" />
					</div>
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
							setOrganizationName(e.target.value)
							handleNameValidation(e.target.value)
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
		<div className="min-h-[330px] bg-base-100 shadow-lg rounded-xl p-6 mt-2 duration-300 ease-in-out transition-opacity  place-content-center place-items-center">
			<div>
				<div className="rounded-full h-24 w-24 inline table m-auto">
					<FaRegBuilding className="h-full w-full m-auto" />
				</div>
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
							setInviteEmail(e.target.value)
							handleEmailValidation(e.target.value)
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
