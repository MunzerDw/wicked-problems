import { Link } from 'react-router-dom'

function LinkTab({ to, className, ...props }) {
  const selected = window.location.pathname === to
  return (
    <Link
      className={
        'trans ' + (selected ? 'opacity-100' : 'opacity-50 hover:opacity-80')
      }
      to={to}
    >
      {props.children}
    </Link>
  )
}

export default LinkTab
