import { NextPage } from 'next'
import useTimetableStore from '../store'

import ScrollMenu from '../components/ScrollMenu'

const SideWorkspace: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className="min-h-screen flex flex-col w-full bg-neutral p-2">
			<div className="h-1/2 flex flex-row">
				<ScrollMenu data={teachers} isTeacher={true} />
				<ScrollMenu data={subjects} isTeacher={false} />
			</div>
			<div className="h-1/2">checking</div>
		</div>
	)
}

export default SideWorkspace
