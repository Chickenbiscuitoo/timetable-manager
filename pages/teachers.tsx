import type { NextPage } from 'next'
import Head from 'next/head'
import { AiFillGithub } from 'react-icons/ai'

import Sidebar from '../components/Sidebar'
import TeachersTable from '../components/TeachersTable'
import TeachersBarChart from '../components/TeachersBarChart'
import TeacherForm from '../components/TeacherForm'
import TeachersManager from '../components/TeachersManager'

const Stats: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="min-h-screen flex flex-row">
				<Sidebar />
				<div>
					<div className="grid overflow-hidden grid-cols-2 grid-rows-3 gap-2">
						<div className="box row-span-2">
							<TeachersManager />
						</div>
						<div className="box col-start-2 col-span-2">
							<TeachersTable />
						</div>
						<div className="box col-start-2 col-span-2">
							<TeacherForm />
						</div>
						<div className="box col-start-1 col-end-3">
							<TeachersBarChart />
						</div>
					</div>
				</div>
			</main>

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

export default Stats
