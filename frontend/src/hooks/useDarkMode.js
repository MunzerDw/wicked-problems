import { useState, createContext, useEffect, useContext } from 'react'
// https://vimalselvam.com/post/toggle-theme-using-react-hooks/
const DarkModeContext = createContext({ darKMode: false, toogle: () => {} })

function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false) // Default theme is light

  // On mount, read the preferred theme from the persistence
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    document.getElementById('html').setAttribute('class', isDark ? 'dark' : '')
    setDarkMode(isDark)
  }, [darkMode])

  // To toggle between dark and light modes
  const toggle = () => {
    const isDark = !darkMode
    localStorage.setItem('darkMode', JSON.stringify(isDark))
    document.getElementById('html').setAttribute('class', isDark ? 'dark' : '')
    setDarkMode(isDark)
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}

function useDarkMode() {
  return { ...useContext(DarkModeContext) }
}

export { DarkModeProvider, useDarkMode, DarkModeContext }
