import { NextPage } from 'next'

import { useState } from 'react'
import useTimetableStore from '../store'

import { FaRegBuilding, FaRegUser } from 'react-icons/fa'

const ProfileCard: NextPage = () => {
	const { setMode } = useTimetableStore()

	const [checked, setChecked] = useState(false)

	const handleChange = () => {
		setChecked(!checked)

		if (checked) {
			setMode('organization')
		} else {
			setMode('personal')
		}
	}

	return (
		<label className="btn btn-circle swap swap-rotate">
			<input type="checkbox" onChange={handleChange} />

			<FaRegUser className="swap-off fill-current" />

			<FaRegBuilding className="swap-on fill-current" />
		</label>
	)
}

export default ProfileCard
