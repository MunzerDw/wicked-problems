import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import projectsModel from 'models/Projects'
import Flex from 'components/Flex'
import Button from 'components/Button'
import Input from 'components/Input'
import { useHistory } from 'react-router'
import ThemeToogle from 'components/ThemeToogle'
import projects from 'models/Projects'
import ProjectSection from './components/ProjectSection'

const PublicProjects = observer(() => {
  const history = useHistory()
  const [search, setSearch] = useState('')
  useEffect(() => {
    projectsModel.loadProjects()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Flex.Col className="h-full w-full p-6 overflow-y-auto bg-gray-200 dark:bg-gray-800">
        <Flex.Row className="w-full" justify="between" align="start">
          <Flex.Col className="">
            <div className="text-3xl">Discover public wicked problems</div>
            <div className="">
              View projects of wicked problems that users have put for the
              public to view
            </div>
          </Flex.Col>
          <Flex.Row>
            <Button
              onClick={() => {
                history.push('/signin')
              }}
              basic
            >
              Sign in
            </Button>
            <Button
              onClick={() => {
                history.push('/signup')
              }}
              basic
            >
              Sign up
            </Button>
            <ThemeToogle />
          </Flex.Row>
        </Flex.Row>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
        />
        {projects.projects
          .filter((project) => {
            if (!search) return true
            if (
              project.name
                ?.toLocaleLowerCase()
                .includes(search.toLocaleLowerCase())
            ) {
              return true
            } else {
              return false
            }
          })
          .map((project, i) => {
            return <ProjectSection key={i} project={project} />
          })}
      </Flex.Col>
    </div>
  )
})

export default PublicProjects
