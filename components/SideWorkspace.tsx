import { NextPage } from 'next'
import useTimetableStore from '../store'

import ScrollMenu from '../components/ScrollMenu'

const SideWorkspace: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className="w-1/3 min-h-screen flex">
			<ScrollMenu data={teachers} isTeacher={true} />
			<ScrollMenu data={subjects} isTeacher={false} />
		</div>
	)
}

export default SideWorkspace
