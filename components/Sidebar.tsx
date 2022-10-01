import { NextPage } from 'next'
import { FcSoundRecordingCopyright } from 'react-icons/fc'

const Sidebar: NextPage = () => {
	return (
		<div className="min-h-screen flex">
			<div className="py-4 px-3 bg-neutral w-40">
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
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="flex items-center p-2 text-base font-normal rounded-lg hover:bg-primary"
						>
							<FcSoundRecordingCopyright className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">btn</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
