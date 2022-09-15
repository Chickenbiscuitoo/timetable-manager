import { NextPage } from 'next'
import useTimetableStore from '../store'

import ScrollMenu from './ScrollMenu'
import Checking from './Checking'

const SideWorkspace: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className="min-h-screen flex flex-col bg-neutral p-2">
			<div className="h-50vh flex flex-row">
				<ScrollMenu data={teachers} isTeacher={true} />
				<ScrollMenu data={subjects} isTeacher={false} />
			</div>
			<div>
				<Checking />
			</div>
		</div>
	)
}

export default SideWorkspace
