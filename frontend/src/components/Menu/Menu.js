import Tab from './components/Tab'
import { contexts } from 'states'
import { useContext } from 'react'
import MenuToggle from 'components/CanvasPage/components/MenuToggle'
import Flex from 'components/Flex'

function Menu() {
  const { menuOpen } = useContext(contexts.GlobalCtx)
  const projectName = window.location.pathname.split('/')[2]
  return (
    <div
      className={
        'w-full h-screen absolute bg-gray-200 dark:bg-gray-700 flex flex-col overflow-hidden '
      }
      style={{
        zIndex: '1000',
        transitionDuration: '250ms',
        maxWidth: menuOpen ? '250px' : '0px',
      }}
    >
      <div className="p-1 flex justify-between w-full">
        <div
          className="text-2xl font-medium dark:text-white p-4"
          style={{
            fontFamily: 'Pattaya',
          }}
        >
          Wicked Problems
        </div>
        <MenuToggle />
      </div>
      <Flex.Col className="p-6">
        <Tab
          icon="FaProjectDiagram"
          text="Canvas"
          to={'/projects/' + projectName}
        />
        <Tab
          icon="FaChartLine"
          text="Statistics"
          to={'/projects/' + projectName + '/statistics'}
        />
        <Tab
          icon="FaFileAlt"
          text="Snapshots"
          to={'/projects/' + projectName + '/snapshots'}
        />
        <Tab
          icon="FaChartPie"
          text="Public Analysis"
          to={'/projects/' + projectName + '/publicanalysis'}
        />
        <Tab icon="FaHome" text="Home" to="/" />
      </Flex.Col>
    </div>
  )
}
export default Menu
