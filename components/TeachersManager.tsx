import { NextPage } from 'next'
import useTimetableStore from '../store'

import TeachersManagerCell from './TeachersManagerCell'

const TeachersManager: NextPage = () => {
	const { teachers } = useTimetableStore()

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
							<th>Email</th>
							<th>Lessons Teaching</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{teachers.map((teacher) => (
							<TeachersManagerCell
								key={teacher.id}
								id={teacher.id}
								name={teacher.name}
								shortname={teacher.shortname}
								email={teacher.email}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Email</th>
							<th>Lessons Teaching</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default TeachersManager
