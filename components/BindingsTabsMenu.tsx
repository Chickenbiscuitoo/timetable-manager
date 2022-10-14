import { NextPage } from 'next'
import useTimetableStore from '../store'

const BindingsTabsMenu: NextPage = () => {
	const { classes, selectedGrade, setSelectedGrade } =
		useTimetableStore()

	const allGrades = classes.map((cl) => cl.grade)
	const grades = [...new Set(allGrades)].sort()

	const tabs = grades.map((gr, i) => (
		<a
			key={i}
			onClick={() => setSelectedGrade(gr)}
			className={`tab tab-bordered ${
				selectedGrade === gr && 'tab-active font-semibold'
			}`}
		>
			<h3>{gr}. grade</h3>
		</a>
	))

	return <div className="tabs mt-5 flex-1">{tabs}</div>
}
export default BindingsTabsMenu
