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
				<div className="flex flex-col w-screen p-5">
					<div className="flex flex-row w-full">
						<div className="flex bg-primary p-5 m-2 place-content-center rounded-xl flex-1">
							<TeachersManager />
						</div>
						<div className="flex flex-col overflow-x-auto">
							<div className="flex bg-primary p-5 m-2 place-content-center rounded-xl">
								<TeachersTable />
							</div>
							<div className="flex bg-primary p-5 m-2 place-content-center rounded-xl h-full">
								<TeacherForm />
							</div>
						</div>
					</div>
					<div className="bg-primary p-5 m-2 rounded-xl w-full">
						<TeachersBarChart />
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
