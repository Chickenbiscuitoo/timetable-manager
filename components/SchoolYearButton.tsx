import type { NextPage } from 'next'

import useTimetableStore from '../store'

const SchoolYearButton: NextPage = ({}) => {
	const { schoolYear } = useTimetableStore()

	return <h1 className="font-semibold btn btn-sm mr-5">{schoolYear}</h1>
}

export default SchoolYearButton
