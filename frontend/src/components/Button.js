import React from 'react'
import Loading from './Loading'
import { useHistory } from 'react-router'
import Icon from './Icon'
import { useDarkMode } from '../hooks/useDarkMode'

function Button({
  className,
  color,
  icon,
  basic,
  iconBtn,
  loading,
  iconSize,
  iconColor,
  form,
  ...props
}) {
  const history = useHistory()
  const { darkMode } = useDarkMode()

  let style = ''
  if (props.disabled) {
    style += 'bg-secondary-300 cursor-not-allowed'
  } else {
    color = color || (darkMode ? 'white' : 'black')
    style += basic
      ? `bg-transparent text-${color}-500 text-${color} border border-${color}-500 border-${color} hover:text-${color}-600 dark:hover:text-${color}-400 hover:text-${color} hover:border-${color}-600 dark:hover:border-${color}-400`
      : `bg-${color}-500 hover:bg-${color}-400`
  }
  style += ` h-8 relative trans focus:outline-none leading-none flex space-x-2 cursor-pointer
    ${icon ? 'justify-between' : 'justify-center'} 
    ${icon && !props.children ? 'w-8 p-2 border-none' : 'rounded px-4 py-2'} 
    ${className ? className : ''} `

  const children = (
    <>
      {icon && !props.children ? (
        <Icon
          size={iconSize}
          className={'m-auto ' + (loading ? 'invisible' : 'visible')}
          color={iconColor}
          name={icon}
        />
      ) : (
        <>
          {icon && (
            <div>
              <Icon name={icon} className={loading ? 'invisible' : 'visible'} />
            </div>
          )}
          <div className={'text-h4 ' + (loading ? 'invisible' : 'visible')}>
            {props.children}
          </div>
        </>
      )}
      {loading && <Loading />}
    </>
  )
  if (props.type === 'submit' && !loading) {
    return (
      <input
        type="submit"
        className={style}
        disabled={props.disabled || loading}
        value={props.children}
        form={form}
      />
    )
  } else if (props.href) {
    return (
      <a
        {...props}
        disabled={props.disabled || loading}
        className={style}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (props.href) {
            history.push(props.href)
          } else if (props.onClick) {
            props.onClick(e)
          }
        }}
      >
        {children}
      </a>
    )
  } else {
    return (
      <button
        {...props}
        disabled={props.disabled || loading}
        className={style}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (props.href) {
            history.push(props.href)
          } else if (props.onClick) {
            props.onClick(e)
          }
        }}
      >
        {children}
      </button>
    )
  }
}

export default Button
