import { NextPage } from 'next'
import useTimetableStore from '../store'

import ScrollMenu from './ScrollMenu'
import Checking from './Checking'

const SideWorkspace: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className="min-h-screen max-h-full flex flex-col w-full bg-neutral p-2">
			<div className="h-1/2 flex flex-row">
				<ScrollMenu data={teachers} isTeacher={true} />
				<ScrollMenu data={subjects} isTeacher={false} />
			</div>
			<div className="h-1/2">
				<Checking />
			</div>
		</div>
	)
}

export default SideWorkspace
