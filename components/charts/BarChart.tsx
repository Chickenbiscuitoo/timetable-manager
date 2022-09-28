import { NextPage } from 'next'

import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { CategoryScale } from 'chart.js'

interface chartData {
	labels: string[]
	datasets: {
		label: string
		data: any[]
		backgroundColor: string[]
		borderColor: string
		borderWidth: number
	}[]
}

interface BarChartProps {
	chartData: chartData
}

const BarChart: NextPage<BarChartProps> = ({ chartData }: any) => {
	ChartJS?.register(CategoryScale)

	return <Bar data={chartData} />
}

export default BarChart
