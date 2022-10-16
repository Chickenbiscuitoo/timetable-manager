import type { NextPage } from 'next'

import { useState } from 'react'
import useTimetableStore from '../store'

import { RiFileCopyLine } from 'react-icons/ri'

interface copyProps {
	selectedClass: number
}

const BindingsCopyButton: NextPage<copyProps> = ({ selectedClass }) => {
	const [clicked, setClicked] = useState(false)

	const { classes, copyBindings } = useTimetableStore()

	const handleClick = (e: any) => {
		const destId = parseInt(e.target.id)
		copyBindings(selectedClass, destId)
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
				className="btn btn-sm"
				onClick={() => setClicked((prevState) => !prevState)}
			>
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

export default BindingsCopyButton
