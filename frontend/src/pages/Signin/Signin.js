import firebase from 'firebase/app'
import { useState } from 'react'
import Button from 'components/Button'
import Form from 'components/Form'
import Input from 'components/Input'
import LoginBg from 'assets/loginBg.jpg'
import ThemeToogle from 'components/ThemeToogle'
import { useDarkMode } from 'hooks/useDarkMode'
import Flex from 'components/Flex'
import SimpleButton from 'components/SimpleButton'
import { useHistory } from 'react-router'

function Signin() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { darkMode } = useDarkMode()

  return (
    <section
      className="relative w-screen h-screen flex"
      style={{
        backgroundImage: `url(${LoginBg})`,
        backgroundSize: 'cover',
      }}
    >
      <div
        className={
          'absolute w-screen h-screen bg-gray-100 dark:bg-gray-700 ' +
          (darkMode ? 'opacity-75' : 'opacity-60')
        }
      ></div>
      <ThemeToogle
        className="z-50 mr-4 mt-4"
        style={{ position: 'absolute', right: '0' }}
      />
      <Form
        className="m-auto z-40"
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
          } catch (error) {
            const errorMessage = error.message
            setError(errorMessage)
          }
          setLoading(false)
        }}
      >
        <div className="text-4xl">Sign In</div>
        <div className="space-y-2">
          <Input
            name="email"
            label="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value)
            }}
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value)
            }}
            required
          />
        </div>
        {error && <div className="text-red-700">{error}</div>}
        <Button loading={loading} basic type="submit" className="w-full">
          Sign in
        </Button>
        <Flex.Row space="2">
          <div>Don't have an account?</div>
          <SimpleButton
            onClick={() => {
              history.push('/signup')
            }}
            text="Sign up"
            className="font-bold text-gray-900 dark:text-indigo-100"
          />
        </Flex.Row>
        <Button
          icon="FaGoogle"
          className="text-white"
          color="indigo"
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(googleAuthProvider)
          }}
        >
          Login with Google
        </Button>
      </Form>
    </section>
  )
}

export default Signin
