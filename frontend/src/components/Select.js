import React, { useState, useRef } from 'react'
import Icon from './Icon'
import useOutsideAlerter from 'hooks/useOutsideAlerter'

export default function Select({
  setSelectedItem,
  selectedItem,
  placeholder,
  data,
  className,
  trigger,
  label,
  disabled,
}) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, () => {
    setActive(false)
  })
  return (
    <div
      ref={wrapperRef}
      className={
        'flex flex-col space-y-1 justify-between cursor-pointer ' + className
      }
    >
      <label className="text-h5">{label}</label>
      <div className="relative">
        {React.cloneElement(
          trigger ? (
            trigger
          ) : (
            <button
              className={
                'selectSingle w-full focus:outline-none trans flex items-center justify-between space-x-2 px-3 p-2 pr-0 ' +
                (!disabled ? 'cursor-pointer' : 'cursor-default')
              }
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setActive(!active)
              }}
            >
              <div
                className={
                  'selectSingle truncate text-h4 ' +
                  (!disabled ? 'cursor-pointer' : 'cursor-default')
                }
              >
                {(selectedItem && selectedItem.key) || placeholder}
              </div>
              <div
                className={
                  'selectSingle inline-flex items-center px-3 ' +
                  (!disabled ? 'cursor-pointer' : 'cursor-default')
                }
              >
                {!disabled && (
                  <Icon
                    className="pointer-events-none"
                    name={active ? 'FaAngleUp' : 'FaAngleDown'}
                  />
                )}
              </div>
            </button>
          ),
          {
            onClick: () => {
              setActive(!active)
            },
          }
        )}
        <div
          className={
            'selectSingle absolute max-h-32 w-full mt-1 overflow-auto flex flex-col shadow trans rounded origin-bottom-left z-40 bg-white dark:bg-gray-600 ' +
            (active
              ? 'opacity-100 scale-100 visible'
              : 'opacity-0 scale-75 hidden')
          }
          style={{
            width: 'max-content',
          }}
        >
          {data.map((item, i) => {
            const selected = (selectedItem && selectedItem.value) === item.value
            return (
              <Item
                key={i}
                onClick={() => {
                  if (!selected) {
                    setSelectedItem(item)
                    setActive(false)
                  } else {
                    setSelectedItem(undefined)
                  }
                }}
                selected={selected}
              >
                {item.key}
              </Item>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Item({ selected, ...props }) {
  return (
    <div
      className={
        'selectSingle text-h5 cursor-pointer trans px-3 py-2 hover:bg-secondary-100 ' +
        (selected && 'opacity-50 bg-secondary-50')
      }
      {...props}
    >
      {props.children}
    </div>
  )
}
