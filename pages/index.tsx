import type { NextPage } from 'next'
import Head from 'next/head'

import useTimetableStore from '../store'

import { AiFillGithub } from 'react-icons/ai'

import BindingsTable from '../components/BindingsTable'
import Sidebar from '../components/Sidebar'
import BindingsTabsMenu from '../components/BindingsTabsMenu'
import BindingsSideWorkspace from '../components/BindingsSideWorkspace'
import ModeButton from '../components/ModeButton'
import SchoolYearButton from '../components/SchoolYearButton'
import ErrorMessageCard from '../components/ErrorMessageCard'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Home: NextPage = () => {
	const { errorMessage, subjects, classes } = useTimetableStore()

	const warning = () => {
		if (subjects.length === 0 && classes.length === 0) {
			return 'You have no subjects and classes, please add some'
		} else if (subjects.length === 0) {
			return 'You have no subjects, please add some'
		} else if (classes.length === 0) {
			return 'You have no classes, please add some'
		}
	}

	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<DndProvider backend={HTML5Backend}>
				<main className="min-h-screen flex flex-row relative">
					<Sidebar />
					<div className="w-full p-5">
						<div className="flex flex-row items-end mx-5">
							<BindingsTabsMenu />

							<SchoolYearButton />

							<ModeButton />
						</div>
						{subjects.length > 0 && classes.length > 0 ? (
							<BindingsTable />
						) : (
							<div className="flex flex-col items-center justify-center h-screen">
								<h1 className="text-2xl font-semibold">
									Subjects: {subjects.length}
								</h1>
								<h1 className="text-2xl font-semibold">
									Classes: {classes.length}
								</h1>
								<p className="text-lg text-primary">
									{warning()}
								</p>
							</div>
						)}
					</div>
					<BindingsSideWorkspace />
				</main>
			</DndProvider>

			<footer className="flex place-content-center border-t-2 border-neutral pt-6 pb-6">
				<a
					href="https://github.com/Chickenbiscuitoo"
					target="_blank"
					rel="noopener noreferrer"
					className="text-neutral"
				>
					Created by Chickenbiscuitoo
					<span className="ml-1 inline">
						<AiFillGithub className="inline h-full" />
					</span>
				</a>
			</footer>
			{errorMessage && (
				<ErrorMessageCard errorMessage={errorMessage} />
			)}
		</div>
	)
}

export default Home
