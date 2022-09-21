import { useDarkMode } from '../hooks/useDarkMode'
import Button from './Button'

function ThemeToogle({ className, ...props }) {
  const { darkMode, toggle } = useDarkMode()
  return (
    <Button
      {...props}
      className={'rounded-full ' + className}
      basic
      color={darkMode ? 'white' : 'yellow'}
      icon={darkMode ? 'FaMoon' : 'FaSun'}
      onClick={() => {
        toggle()
      }}
      iconBtn
    />
  )
}

export default ThemeToogle
