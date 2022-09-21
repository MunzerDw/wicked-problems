import Flex from './Flex'
import Icon from './Icon'

function Small({ value, text, icon, ...props }) {
  return (
    <Flex.Row justify="between" className="text-gray-500 w-full">
      <Flex.Row space="1">
        <Icon name={icon} />
        <div>{text}</div>
      </Flex.Row>
      <div className="font-bold">{value}</div>
    </Flex.Row>
  )
}

function Medium({ value, text, icon, className, ...props }) {
  return (
    <div className={'h-48 w-48 rounded shadow-lg flex relative ' + className}>
      <div className="absolute top-0 p-3 w-full flex justify-between">
        <div>{text}</div>
        <Icon name={icon} />
      </div>
      <div className="text-6xl m-auto font-bold">{value}</div>
    </div>
  )
}

const NumberStat = {
  Small,
  Medium,
}

export default NumberStat
