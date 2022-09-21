import firebase from 'firebase/app'
import 'firebase/auth'
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from '@react-firebase/auth'
import Router from './components/Router'
import axios from 'axios'
import { States } from '../states'
import LoadingPage from '../pages/LoadingPage/LoadingPage'
import { DarkModeProvider } from '../hooks/useDarkMode'
import Signin from 'pages/Signin/Signin'
import Signup from 'pages/Signup/Signup'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import NotFound from 'pages/NotFound/NotFound'
import PublicProjects from 'pages/PublicProjects/PublicProjects'
import Project from 'pages/Project/Project'
import Statistics from 'pages/Statistics/Statistics'
import Snapshots from 'pages/Snapshots/Snapshots'

require('dotenv').config()

function App() {
  return (
    <FirebaseAuthProvider
      firebase={firebase}
      {...{
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      }}
    >
      <div className="dark:text-white">
        <DarkModeProvider>
          <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId, ...authState }) => {
              if (isSignedIn) {
                console.log(user)
                const accessToken = user?.za
                axios.defaults.headers = {
                  authorization: 'Bearer ' + accessToken,
                }
              }
              return !providerId && !isSignedIn ? (
                <LoadingPage />
              ) : isSignedIn ? (
                <States>
                  <Router />
                </States>
              ) : (
                <BrowserRouter>
                  <Switch>
                    <Route exact path="/">
                      <PublicProjects />
                    </Route>
                    <Route exact path="/signin">
                      <Signin />
                    </Route>
                    <Route exact path="/signup">
                      <Signup />
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
                    <Route>
                      <NotFound />
                    </Route>
                  </Switch>
                </BrowserRouter>
              )
            }}
          </FirebaseAuthConsumer>
        </DarkModeProvider>
      </div>
    </FirebaseAuthProvider>
  )
}

export default App
