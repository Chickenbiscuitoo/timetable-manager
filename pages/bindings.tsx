import type { NextPage } from 'next'
import Head from 'next/head'

import useTimetableStore from '../store'

import { AiFillGithub } from 'react-icons/ai'

import BindingsMainContent from '../components/BindingsMainContent'

import Sidebar from '../components/Sidebar'
import BindingsTabsMenu from '../components/BindingsTabsMenu'
import BindingsSideWorkspace from '../components/BindingsSideWorkspace'
import ModeButton from '../components/ModeButton'
import SchoolYearButton from '../components/SchoolYearButton'
import ErrorMessageCard from '../components/ErrorMessageCard'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Bindings: NextPage = () => {
	const { errorMessage } = useTimetableStore()

	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<DndProvider backend={HTML5Backend}>
				<main className="min-h-screen flex flex-row relative select-none">
					<Sidebar />
					<div className="w-full p-5">
						<div className="flex flex-row items-end mx-5">
							<BindingsTabsMenu />

							<SchoolYearButton />

							<ModeButton />
						</div>
						<BindingsMainContent />
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
					Chickenbiscuitoo
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

export default Bindings
