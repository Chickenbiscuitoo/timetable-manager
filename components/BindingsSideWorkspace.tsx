import { NextPage } from 'next'
import useTimetableStore from '../store'

import BindingsScrollMenu from './BindingsScrollMenu'
import BindingsChecking from './BindingsChecking'

import LoadingSpinner from './LoadingSpinner'

const BindingsSideWorkspace: NextPage = () => {
	const { teachers, teachersLoading } = useTimetableStore()

	return (
		<div className="min-h-screen flex flex-col bg-neutral p-2 min-w-64">
			<div className="h-50vh flex flex-row">
				{teachersLoading ? (
					<LoadingSpinner />
				) : teachers.length === 0 ? (
					<div className="flex flex-col items-center justify-center w-full">
						<h1 className="text-lg font-bold text-primary">
							No teachers
						</h1>
						<p className="text-xs">Please add some teachers</p>
					</div>
				) : (
					<BindingsScrollMenu teachers={teachers} />
				)}
			</div>
			<div className="h-50vh flex">
				<BindingsChecking />
			</div>
		</div>
	)
}

export default BindingsSideWorkspace
