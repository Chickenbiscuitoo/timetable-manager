import { NextPage } from 'next'
import useTimetableStore from '../store'

import { classesSort } from '../utils/arraysFuncs'

import ClassesManagerCell from './ClassesManagerCell'

const ClassesManager: NextPage = () => {
	const { classes } = useTimetableStore()

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
							<th>Teacher</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{classes.sort(classesSort).map((cl) => (
							<ClassesManagerCell
								key={cl.id}
								id={cl.id}
								name={cl.name}
								teacher={cl.teacher}
								grade={cl.grade}
							/>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Teacher</th>
							<th>Lessons</th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default ClassesManager
