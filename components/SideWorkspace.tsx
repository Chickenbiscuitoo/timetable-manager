import { NextPage } from 'next'
import useTimetableStore from '../store'

import ScrollMenu from '../components/ScrollMenu'

const SideWorkspace: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className="min-h-screen bg-gray-800">
			<div>
				<ScrollMenu data={teachers} isTeacher={true} />
				<ScrollMenu data={subjects} isTeacher={false} />
			</div>
			jou
		</div>
	)
}

export default SideWorkspace
