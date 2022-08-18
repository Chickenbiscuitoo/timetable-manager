import type { NextPage } from 'next'
import styles from '../styles/ScrollMenu.module.css'
import { useState } from 'react'

import MenuItem from '../components/MenuItem'

interface Props {
	data: any
	isTeacher: boolean
}

const ScrollMenu: NextPage<Props> = ({ data, isTeacher }) => {
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

			{data
				.filter((item: any) =>
					item.name.toLowerCase().includes(filter.toLowerCase())
				)
				.map((i: any) => (
					<MenuItem
						key={i.id}
						id={i.id}
						name={i.name}
						isTeacher={isTeacher}
					/>
				))}
		</div>
	)
}

export default ScrollMenu
