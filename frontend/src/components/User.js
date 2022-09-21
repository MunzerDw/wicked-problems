import React from 'react'
import firebase from 'firebase/app'
import { FirebaseAuthConsumer } from '@react-firebase/auth'
import Dropdown from './Dropdown'
import axios from 'axios'

function User() {
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user, providerId, ...authState }) => {
        return (
          <Dropdown
            actions={[
              {
                key: 'Sign out',
                action: () => {
                  firebase.auth().signOut()
                  axios.defaults.headers = {
                    authorization: '',
                  }
                },
              },
            ]}
            trigger={
              <div className="flex space-x-2 items-center cursor-pointer">
                <div className="bg-blue-300 w-8 h-8 p-1 flex items-center justify-center text-sm rounded-full">
                  {(user?.displayName || user?.email)
                    ?.split(' ')
                    .map((str) => str[0].toUpperCase())
                    .join('')}
                </div>
                <div>{user?.displayName || user?.email}</div>
              </div>
            }
          />
        )
      }}
    </FirebaseAuthConsumer>
  )
}

export default User
