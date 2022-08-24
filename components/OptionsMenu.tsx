import type { NextPage } from 'next'
import styles from '../styles/ScrollMenu.module.css'
import { useState } from 'react'

import useTimetableStore from '../store'

const OptionsMenu: NextPage = () => {
	const { classes, setSelectedClass, selectedClass } =
		useTimetableStore()

	const [filter, setFilter] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFilter(e.target.value)

	return (
		<div className={styles.scrollmenu}>
			<input
				type="text"
				value={filter}
				onChange={handleChange}
				placeholder="Search"
				className={styles.searchbar}
			/>

			{classes
				.filter((item: any) =>
					item.name.toLowerCase().includes(filter.toLowerCase())
				)
				.map((i: any) => (
					<a
						key={i.id}
						onClick={() => setSelectedClass(i.id)}
						className={
							styles[
								selectedClass === i.id ? 'selected' : ''
							]
						}
					>
						{i.name}
					</a>
				))}
		</div>
	)
}

export default OptionsMenu
