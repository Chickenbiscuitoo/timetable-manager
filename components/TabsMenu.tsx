import { NextPage } from 'next'
import useTimetableStore from '../store'

const TabsMenu: NextPage = () => {
	const { classes, selectedClass, setSelectedClass } =
		useTimetableStore()

	const tabs = classes.map((cl) => (
		<a
			key={cl.id}
			id={cl.id.toString()}
			onClick={() => setSelectedClass(cl.id)}
			className={`tab tab-bordered ${
				selectedClass === cl.id && 'tab-active font-semibold'
			}`}
		>
			{cl.name}
		</a>
	))

	return <div className="tabs mt-5 ml-5">{tabs}</div>
}
export default TabsMenu
