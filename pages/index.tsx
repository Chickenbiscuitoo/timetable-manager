import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { AiFillGithub } from 'react-icons/ai'
import useTimetableStore from '../store'

import Timetable from '../components/Timetable'
import ScrollMenu from '../components/ScrollMenu'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Home: NextPage = () => {
	const { teachers, subjects } = useTimetableStore()

	return (
		<div className={styles.container}>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<DndProvider backend={HTML5Backend}>
				<main className={styles.main}>
					<ScrollMenu data={teachers} isTeacher={true} />
					<ScrollMenu data={subjects} isTeacher={false} />
					<Timetable />
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
