import type { NextPage } from 'next'

import { useState } from 'react'
import useTimetableStore from '../store'

import { RiFileCopyLine } from 'react-icons/ri'

const CopyButton: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { selectedClass, classes, copyLessons } = useTimetableStore()

	const handleClick = (e: any) => {
		const destId = parseInt(e.target.id)
		copyLessons(selectedClass, destId)
	}

	const classList = classes.map((cl) => (
		<li key={cl.id}>
			<a id={cl.id.toString()} onClick={handleClick}>
				{cl.name}
			</a>
		</li>
	))

	return (
		<div className="dropdown">
			<label
				tabIndex={0}
				className="btn btn-sm gap-2 m-1"
				onClick={() => setClicked((prevState) => !prevState)}
			>
				Copy
				<RiFileCopyLine />
			</label>
			{clicked && (
				<ul
					tabIndex={0}
					className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
				>
					{classList}
				</ul>
			)}
		</div>
	)
}

export default CopyButton
