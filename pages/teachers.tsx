import type { NextPage } from 'next'
import Head from 'next/head'

import useTimetableStore from '../store'

import { AiFillGithub } from 'react-icons/ai'

import Sidebar from '../components/Sidebar'
import TeachersTable from '../components/TeachersTable'
import TeachersBarChart from '../components/TeachersBarChart'
import TeacherForm from '../components/TeacherForm'
import TeachersManager from '../components/TeachersManager'
import ErrorMessageCard from '../components/ErrorMessageCard'
import SendBindingsButton from '../components/SendBindingsButton'
import AlertMessageCard from '../components/AlertMessageCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Teachers: NextPage = () => {
	const { teachers, teachersLoading, errorMessage, alertMessage } =
		useTimetableStore()

	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="min-h-screen flex flex-row relative">
				<Sidebar />
				{teachersLoading ? (
					<LoadingSpinner />
				) : teachers.length > 0 ? (
					<div className="flex flex-col p-3 place-content-center place-items-center w-full h-full">
						<div className="flex flex-row max-h-fit h-fit">
							<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 h-fit">
								<TeachersManager />
								<div className="mt-3">
									<SendBindingsButton />
								</div>
							</div>
							<div className="grid grid-cols-1 grid-rows-2 max-h-fit">
								<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 max-h-fit h-fit">
									<TeachersTable />
								</div>
								<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 max-h-fit h-fit">
									<TeacherForm />
								</div>
							</div>
						</div>
						<div className="grid p-2 m-2 h-fit border-8 border-opacity-30 rounded-xl border-primary w-2/3">
							<TeachersBarChart />
						</div>
					</div>
				) : (
					<div className="flex flex-col place-content-center place-items-center w-full h-full">
						<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 h-fit">
							<TeacherForm />
						</div>
					</div>
				)}
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
			{errorMessage && (
				<ErrorMessageCard errorMessage={errorMessage} />
			)}
			{alertMessage.message && <AlertMessageCard />}
		</div>
	)
}

export default Teachers
