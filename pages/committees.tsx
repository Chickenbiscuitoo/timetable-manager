import type { NextPage } from 'next'
import Head from 'next/head'

import useTimetableStore from '../store'

import { AiFillGithub } from 'react-icons/ai'

import Sidebar from '../components/Sidebar'
import CommitteesBarChart from '../components/CommitteesBarChart'
// import CommitteesForm from '../components/CommitteesForm'
// import CommitteesManager from '../components/CommitteesManager'
import ErrorMessageCard from '../components/ErrorMessageCard'
import LoadingSpinner from '../components/LoadingSpinner'

const Committees: NextPage = () => {
	const { committees, committeesLoading, errorMessage } =
		useTimetableStore()

	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen flex flex-row relative">
				<Sidebar />
				{committeesLoading ? (
					<LoadingSpinner />
				) : committees.length > 0 ? (
					<div className="flex flex-col p-3 place-content-center place-items-center w-full h-full">
						<div className="flex flex-row max-h-fit h-fit">
							<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 h-fit">
								{/* <CommitteesManager /> */}
							</div>
							<div className="grid grid-cols-1 grid-rows-2 max-h-fit">
								<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 max-h-fit h-fit">
									{/* <CommitteesForm /> */}
								</div>
							</div>
						</div>
						<div className="grid p-2 m-2 h-fit border-8 border-opacity-30 rounded-xl border-primary w-2/3">
							<CommitteesBarChart />
						</div>
					</div>
				) : (
					<div className="flex flex-col place-content-center place-items-center w-full h-full">
						<div className="grid bg-primary bg-opacity-30 rounded-xl p-4 m-2 h-fit">
							{/* <CommitteesForm /> */}
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

export default Committees
