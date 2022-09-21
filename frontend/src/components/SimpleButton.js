import Flex from 'components/Flex'
import Icon from './Icon'

function SimpleButton({
  text,
  icon,
  onClick,
  className,
  iconRight,
  active,
  ...props
}) {
  return (
    <Flex.Row
      onClick={onClick}
      space="1"
      className={
        'cursor-pointer hover:opacity-100 ' +
        (active ? 'opacity-100' : 'opacity-75') +
        ' ' +
        className
      }
    >
      {icon && !iconRight && <Icon size={12} name={icon} />}
      <div>{text}</div>
      {icon && iconRight && <Icon size={12} name={icon} />}
    </Flex.Row>
  )
}

export default SimpleButton
