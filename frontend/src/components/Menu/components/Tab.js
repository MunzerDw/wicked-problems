import Flex from 'components/Flex'
import Icon from 'components/Icon'
import { Link } from 'react-router-dom'
import { contexts } from 'states'
import { useContext } from 'react'

function Tab({ text, icon, to, ...props }) {
  const selected = window.location.pathname === to
  const { toogleMenu } = useContext(contexts.GlobalCtx)

  return (
    <div
      className={
        'trans ' + (selected ? 'opacity-100' : 'opacity-50 hover:opacity-80')
      }
    >
      <Link to={to} onClick={() => toogleMenu()}>
        <Flex.Row>
          <Icon name={icon} />
          <div>{text}</div>
        </Flex.Row>
      </Link>
    </div>
  )
}
export default Tab
