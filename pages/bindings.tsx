import type { NextPage } from 'next'
import Head from 'next/head'
import { AiFillGithub } from 'react-icons/ai'

import BindingsTable from '../components/BindingsTable'
import CopyButton from '../components/CopyButton'
import Sidebar from '../components/Sidebar'
import TabsMenu from '../components/TabsMenu'
import SideWorkspace from '../components/SideWorkspace'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Bindings: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<DndProvider backend={HTML5Backend}>
				<main className="min-h-screen flex flex-row">
					<Sidebar />
					<div>
						<div className="flex flex-row items-end mx-5">
							<TabsMenu />
							<CopyButton />
						</div>
						<BindingsTable />
					</div>
					<SideWorkspace />
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
		</div>
	)
}

export default Bindings
