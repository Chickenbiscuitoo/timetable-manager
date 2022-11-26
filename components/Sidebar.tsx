import { NextPage } from 'next'

import { BsPersonFill } from 'react-icons/bs'
import { MdClass } from 'react-icons/md'
import { HiUserGroup } from 'react-icons/hi'
import { AiFillCalendar } from 'react-icons/ai'
import { AiFillFile } from 'react-icons/ai'

const Sidebar: NextPage = () => {
	return (
		<div className="min-h-screen flex">
			<div className="py-4 px-3 bg-neutral w-40 relative">
				<a className="flex items-center pl-2.5 mb-5">
					<img
						src="https://upload.wikimedia.org/wikipedia/commons/2/21/Danny_DeVito_by_Gage_Skidmore.jpg"
						className="mr-3 h-6 sm:h-7 rounded-full"
						alt="User avatar"
					/>
					<span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
						Username
					</span>
				</a>
				<ul className="space-y-2">
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<AiFillFile className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Bindings</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<AiFillCalendar className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Timetable</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<BsPersonFill className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Teachers</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<MdClass className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Subjects</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<HiUserGroup className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Classes</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
