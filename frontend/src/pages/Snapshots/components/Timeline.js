import Button from 'components/Button'
import Flex from 'components/Flex'
import Popup from 'components/Popup'
import { observer } from 'mobx-react'
import snapshots from 'models/Snapshots'
import project from 'models/Project'
import TimelineDate from './TimelineDate'

function formatDate(date) {
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
}

const Timeline = observer(() => {
  const actions = project
    .getNodes()
    ?.filter((node) => node.data.type === 'ACTION' && node.data.doneAt)
    ?.sort(
      (a, b) =>
        new Date(a.data.doneAt).getTime() - new Date(b.data.doneAt).getTime()
    )
  let data = {}
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    const date = formatDate(new Date(action.data.doneAt))
    data[date] ? data[date].push(action) : (data[date] = [action])
  }
  return (
    <Popup state={snapshots.timelineOpen} setState={snapshots.setTimelineOpen}>
      <div
        className="bg-white dark:bg-gray-700 shadow-lg rounded p-6 max-h-full overflow-auto relative w-full"
        style={{ maxWidth: '1000px' }}
      >
        <div
          className="sticky top-0 w-full flex justify-end"
          style={{
            left: '500px',
          }}
        >
          <Button
            icon="FaTimes"
            onClick={() => {
              snapshots.setTimelineOpen(false)
            }}
          />
        </div>
        <Flex.Col>
          {Object.keys(data)?.map((date, i) => {
            return (
              <TimelineDate
                key={i}
                noHr={i === 0}
                date={date}
                actions={data[date]}
              />
            )
          })}
        </Flex.Col>
      </div>
    </Popup>
  )
})
export default Timeline
