import type { NextPage } from 'next'
import Head from 'next/head'
import { AiFillGithub } from 'react-icons/ai'

import Sidebar from '../components/Sidebar'
import TeachersTable from '../components/TeachersTable'
import ClassesBarChart from '../components/ClassesBarChart'
import ClassesForm from '../components/ClassesForm'
import ClassesManager from '../components/ClassesManager'

const Classes: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="min-h-screen flex flex-row">
				<Sidebar />
				<div className="flex flex-col p-3">
					<div className="flex flex-row max-h-fit h-fit">
						<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 h-fit">
							<ClassesManager />
						</div>
						<div className="grid grid-cols-1 grid-rows-2 max-h-fit">
							<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 max-h-fit h-fit">
								<TeachersTable />
							</div>
							<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 max-h-fit h-fit">
								<ClassesForm />
							</div>
						</div>
					</div>
					<div className="grid p-2 m-2 h-fit border-8 border-opacity-30 rounded-xl border-primary">
						<ClassesBarChart />
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

export default Classes
