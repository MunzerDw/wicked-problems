import React from 'react'
import Icon from './Icon'

function Input({
  disabled,
  error,
  icon,
  label,
  value,
  unit,
  className,
  ...props
}) {
  return (
    <div className={'flex flex-col w-full space-y-2 ' + className}>
      {label && (
        <label
          htmlFor={props.name}
          className="block text-h5 text-secondary-600 font-normal truncate"
        >
          {label}
        </label>
      )}
      <div className="flex bg-gray-100 dark:bg-gray-500 border border-gray-100 dark:border-gray-500 rounded text-gray-900 dark:text-white">
        {icon ? (
          <span className="inline-flex items-center px-3 pr-0 text-secondary-300 text-sm">
            <Icon name={icon} />
          </span>
        ) : null}
        <input
          {...props}
          value={value || ''}
          type={props.type || 'text'}
          name={props.name}
          className={`flex-1 block w-full p-2 pl-2 focus:outline-none border-0 bg-transparent ${
            disabled
              ? ' cursor-not-allowed bg-secondary-100 border-secondary-200 text-gray-900'
              : ''
          } ${
            error
              ? 'border-danger-500 focus:border-info-500 focus:ring-info-500'
              : 'focus:border-secondary-400 focus:ring-0'
          } sm:text-sm`}
          placeholder={props.placeholder}
          disabled={disabled}
        />
        {unit ? (
          <span className="inline-flex items-center px-3 pl-0 text-secondary-300 text-sm">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default Input
