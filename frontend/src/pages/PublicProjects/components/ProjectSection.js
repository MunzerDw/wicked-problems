import Button from 'components/Button'
import Flex from 'components/Flex'
import NumberStat from 'components/NumberStat'
import { useHistory } from 'react-router-dom'
import TimeAgo from 'javascript-time-ago'

function ProjectSection({ project, ...props }) {
  const history = useHistory()
  const currentdate = new Date(project.createdAt)
  const timeAgo = new TimeAgo('en-EN')
  const timeSince = timeAgo.format(currentdate)
  return (
    <Flex.Col
      className="p-4 rounded shadow-md hover:shadow-xl trans bg-white dark:bg-gray-700"
      style={{ width: '700px' }}
    >
      <Flex.Row justify="between" align="start" space="0" className="w-full">
        <div className="text-2xl">{project.name}</div>
        <Button
          onClick={() => {
            history.push('/projects/' + project.urlSafeName)
          }}
          basic
          colr="red"
        >
          View Project
        </Button>
      </Flex.Row>
      <NumberStat.Small
        value={project.invites.length + 1}
        text="Users"
        icon="FaUsers"
      />
      <NumberStat.Small value={timeSince} text="Created" icon="FaCalendarAlt" />
    </Flex.Col>
  )
}

export default ProjectSection
