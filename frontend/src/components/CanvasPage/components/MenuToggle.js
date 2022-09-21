import Button from 'components/Button'
import { contexts } from 'states'
import { useContext } from 'react'

function MenuToggle() {
  const { toogleMenu } = useContext(contexts.GlobalCtx)
  return <Button icon="FaBars" onClick={() => toogleMenu()} />
}
export default MenuToggle
