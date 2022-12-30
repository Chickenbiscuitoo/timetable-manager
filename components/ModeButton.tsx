import { NextPage } from 'next'

import { useEffect, useState } from 'react'
import useTimetableStore from '../store'

import { FaRegBuilding, FaRegUser } from 'react-icons/fa'

const ProfileCard: NextPage = () => {
	const { mode, setMode } = useTimetableStore()

	const [checked, setChecked] = useState(false)

	useEffect(() => {
		if (mode === 'organization') {
			setChecked(true)
		} else {
			setChecked(false)
		}
	}, [mode])

	const handleChange = () => {
		setChecked(!checked)

		if (!checked) {
			setMode('organization')
		} else {
			setMode('personal')
		}
	}

	return (
		<label className="btn btn-circle swap swap-rotate">
			<input type="checkbox" onChange={handleChange} />

			{mode === 'personal' ? (
				<FaRegUser className="fill-current" />
			) : (
				<FaRegBuilding className="fill-current" />
			)}
		</label>
	)
}

export default ProfileCard
