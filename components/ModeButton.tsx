import { NextPage } from 'next'

import { FaRegBuilding, FaRegUser } from 'react-icons/fa'

const ProfileCard: NextPage = () => {
	return (
		<label className="btn btn-circle swap swap-rotate">
			<input type="checkbox" />

			<FaRegBuilding className="swap-off fill-current" />

			<FaRegUser className="swap-on fill-current" />
		</label>
	)
}

export default ProfileCard
