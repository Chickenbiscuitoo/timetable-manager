import type { NextPage } from 'next'
import styles from '../styles/CopyButton.module.css'

import { useState } from 'react'
import useTimetableStore from '../store'

const CopyButton: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { selectedClass, classes, copyLessons } = useTimetableStore()

	const handleClick = (e: any) => {
		const destId = parseInt(e.target.id)
		copyLessons(selectedClass, destId)
	}

	const classList = classes.map((cl) => (
		<a key={cl.id} id={cl.id.toString()} onClick={handleClick}>
			{cl.name}
		</a>
	))

	return (
		<div
			onMouseLeave={() => setClicked(false)}
			className={styles.copybtn}
		>
			<button onClick={() => setClicked(true)}>
				{clicked ? 'COPY TO	' : 'COPY'}
			</button>
			{clicked && classList}
		</div>
	)
}

export default CopyButton
