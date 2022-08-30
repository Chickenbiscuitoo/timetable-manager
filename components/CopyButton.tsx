import type { NextPage } from 'next'
import styles from '../styles/CopyButton.module.css'

import { useState } from 'react'
import useTimetableStore from '../store'

const CopyButton: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { classes } = useTimetableStore()
	const classList = classes.map((cl) => <a key={cl.id}>{cl.name}</a>)

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
