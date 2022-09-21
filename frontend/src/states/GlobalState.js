import { createContext, useEffect, useState } from 'react'

const Context = createContext()

function Provider(props) {
  // STATE
  const [menuOpen, setMenuOpen] = useState(false)

  // STATE FUNCTIONS
  function toogleMenu() {
    localStorage.setItem('menuOpen', !menuOpen)
    setMenuOpen(!menuOpen)
  }

  // API FUNCTIONS

  // ONLOAD
  useEffect(() => {
    const localStorageMenu = localStorage.getItem('menuOpen')
    setMenuOpen(localStorageMenu === 'true')
  }, [])

  // EXPORTS
  const value = {
    menuOpen,
    toogleMenu,
  }

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

const exports = { Context, Provider }

export default exports
