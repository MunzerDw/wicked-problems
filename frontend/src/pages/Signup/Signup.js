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

function Signup() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
          if (password && password !== confirmPassword) {
            setError("Passwords don't match up")
            setLoading(false)
            return
          }
          try {
            const response = await firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
            await response?.user?.sendEmailVerification()
            await firebase.auth().signInWithEmailAndPassword(email, password)
            // history.push('/')
          } catch (error) {
            const errorMessage = error.message
            setError(errorMessage)
          }
          setLoading(false)
        }}
      >
        <div className="text-4xl">Sign Up</div>
        <div className="space-y-2">
          <Input
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value)
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value)
            }}
            required
          />
        </div>
        {error && <div className="text-red-700 dark:text-red-500">{error}</div>}
        <Button loading={loading} basic type="submit" className="w-full">
          Register
        </Button>
        <Flex.Row space="2">
          <div>Already have an account?</div>
          <SimpleButton
            onClick={() => {
              history.push('/signin')
            }}
            text="Sign in"
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

export default Signup
