import type { NextPage } from 'next'
import styles from '../styles/ScrollMenu.module.css'
import { useState } from 'react'
interface Props {
	data: any
}

const ScrollMenu: NextPage<Props> = ({ data }) => {
	const [filter, setFilter] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFilter(e.target.value)
	console.log(filter)

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
					<a>{i.name}</a>
				))}
		</div>
	)
}

export default ScrollMenu
