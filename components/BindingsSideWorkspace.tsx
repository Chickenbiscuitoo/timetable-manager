import { NextPage } from 'next'
import useTimetableStore from '../store'

import BindingsScrollMenu from './BindingsScrollMenu'
import BindingsChecking from './BindingsChecking'

const BindingsSideWorkspace: NextPage = () => {
	const { teachers } = useTimetableStore()

	return (
		<div className="min-h-screen flex flex-col bg-neutral p-2">
			<div className="h-50vh flex flex-row">
				<BindingsScrollMenu data={teachers} />
			</div>
			<div>
				<BindingsChecking />
			</div>
		</div>
	)
}

export default BindingsSideWorkspace
