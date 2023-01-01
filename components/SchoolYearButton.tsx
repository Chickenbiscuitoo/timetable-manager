import type { NextPage } from 'next'
import { useState } from 'react'

import useTimetableStore from '../store'

const SchoolYearButton: NextPage = ({}) => {
	const { schoolYear, setSchoolYear, schoolYearOptions } =
		useTimetableStore()

	const [clicked, setClicked] = useState(false)

	const handleClick = () => {
		setClicked(!clicked)
	}

	const handleSelect = (e: any) => {
		setSchoolYear(e.target.innerText)
		setClicked(false)
	}

	return (
		<div className="dropdown">
			<label
				onClick={handleClick}
				tabIndex={0}
				className="btn btn-sm mr-5"
			>
				{schoolYear}
			</label>
			<ul
				tabIndex={0}
				className="dropdown-content menu p-2 shadow bg-base-100 rounded-box"
			>
				{clicked &&
					schoolYearOptions.map((year) => (
						<li>
							<a onClick={handleSelect}>{year}</a>
						</li>
					))}
			</ul>
		</div>
	)
}

export default SchoolYearButton
