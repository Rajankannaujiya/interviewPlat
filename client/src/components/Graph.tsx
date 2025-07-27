import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Interview } from '../types/interview'
import { useAppSelector } from '../state/hook'

type GraphProps = {
  data: Interview[]
}

const Graph = ({ data }: GraphProps) => {
  const userAuthState = useAppSelector(state => state.auth)
  const userId = userAuthState.user?.id

  // Calculate counts
  const taken = data.filter(i => i.interviewerId === userId).length
  const attended = data.filter(i => i.candidateId === userId).length

  const chartData = [
    { name: 'Taken', count: taken },
    { name: 'Attended', count: attended }
  ]

  return (
    <div className="w-full h-64 dark:bg-dark-background bg-light-background">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Graph