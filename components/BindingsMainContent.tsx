import type { NextPage } from 'next'

import useTimetableStore from '../store'

import BindingsTable from '../components/BindingsTable'
import LoadingSpinner from './LoadingSpinner'

const BindingsMainContent: NextPage = () => {
	const {
		subjects,
		classes,
		bindingsLoading,
		classesLoading,
		subjectsLoading,
	} = useTimetableStore()

	const warning = () => {
		if (subjects.length === 0 && classes.length === 0) {
			return 'You have no subjects and classes, please add some'
		} else if (subjects.length === 0) {
			return 'You have no subjects, please add some'
		} else if (classes.length === 0) {
			return 'You have no classes, please add some'
		}
	}

	if (bindingsLoading || classesLoading || subjectsLoading) {
		return <LoadingSpinner />
	} else if (subjects.length === 0 || classes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<h1 className="text-2xl font-semibold">
					Subjects: {subjects.length}
				</h1>
				<h1 className="text-2xl font-semibold">
					Classes: {classes.length}
				</h1>
				<p className="text-lg text-primary">{warning()}</p>
			</div>
		)
	}

	return <BindingsTable />
}

export default BindingsMainContent
