import { NextPage } from 'next'
import useTimetableStore from '../store'

import CommitteesManagerCell from './CommitteesManagerCell'

const CommitteesManager: NextPage = () => {
	const { committees } = useTimetableStore()

	return (
		<div>
			<div className="overflow-x-auto w-full max-h-screen">
				<table className="table w-full">
					<thead>
						<tr>
							<th>
								<label>
									<input
										type="checkbox"
										className="checkbox"
									/>
								</label>
							</th>
							<th>Name</th>
							<th>Subjects</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{committees.map((committee) => (
							<CommitteesManagerCell
								key={committee.id}
								id={committee.id}
								name={committee.name}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Subjects</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default CommitteesManager
