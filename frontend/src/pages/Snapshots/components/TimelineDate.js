import Flex from 'components/Flex'

function TimelineDate({ date, actions, noHr }) {
  console.log(date, actions)
  return (
    <Flex.Col className="w-full">
      {!noHr && <hr className="border-t border-gray-500 w-full" />}
      <div className="text-2xl font-medium">{date}</div>
      {actions.map((action) => {
        return <div className="text-2xl font-bold">● {action.data?.text}</div>
      })}
    </Flex.Col>
  )
}

export default TimelineDate
