import { NextPage } from 'next'
import useTimetableStore from '../store'

import SubjectsManagerCell from './SubjectsManagerCell'

const SubjectsManager: NextPage = () => {
	const { subjects } = useTimetableStore()

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
							<th>Commitee</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{subjects.map((subject) => (
							<SubjectsManagerCell
								key={subject.id}
								id={subject.id}
								name={subject.name}
								shortname={subject.shortname}
								commitee_id={subject.commitee_id}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Commitee</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default SubjectsManager
