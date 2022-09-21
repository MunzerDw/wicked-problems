import Statistics from 'pages/Statistics/Statistics'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import NotFound from 'pages/NotFound/NotFound'
import Project from 'pages/Project/Project'
import Projects from 'pages/projects/Projects'
import PublicAnalysis from 'pages/PublicAnalysis/PublicAnalysis'
import Snapshots from 'pages/Snapshots/Snapshots'
import Settings from 'pages/Settings/Settings'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/signup" to="/" />
        <Redirect exact from="/signin" to="/" />
        <Route exact path="/">
          <Projects />
        </Route>
        <Route exact path="/projects/:id">
          <Project />
        </Route>
        <Route exact path="/projects/:id/statistics">
          <Statistics />
        </Route>
        <Route exact path="/projects/:id/snapshots">
          <Snapshots />
        </Route>
        <Route exact path="/projects/:id/publicanalysis">
          <PublicAnalysis />
        </Route>
        <Route exact path="/projects/:id/settings">
          <Settings />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
export default Router
