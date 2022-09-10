import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { AiFillGithub } from 'react-icons/ai'

import Timetable from '../components/Timetable'
import ScrollMenu from '../components/ScrollMenu'
import OptionsMenu from '../components/OptionsMenu'
import Checking from '../components/Checking'
import CopyButton from '../components/CopyButton'
import Sidebar from '../components/Sidebar'
import TabsMenu from '../components/TabsMenu'
import SideWorkspace from '../components/SideWorkspace'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Home: NextPage = () => {
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
						<TabsMenu />
						<Timetable />
					</div>
					<SideWorkspace />
				</main>
			</DndProvider>

			<footer className={styles.footer}>
				<a
					href="https://github.com/Chickenbiscuitoo"
					target="_blank"
					rel="noopener noreferrer"
				>
					Created by Chickenbiscuitoo
					<span className={styles.logo}>
						<AiFillGithub />
					</span>
				</a>
			</footer>
		</div>
	)
}

export default Home
