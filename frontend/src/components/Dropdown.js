import useOutsideAlerter from 'hooks/useOutsideAlerter'
import React, { useState, useRef } from 'react'
import Icon from './Icon'

export default function Dropdown({
  placeholder,
  actions,
  className,
  label,
  trigger,
}) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, () => {
    setActive(false)
  })
  return (
    <div ref={wrapperRef} className={'flex flex-col ' + className}>
      {label && <label className="block text-h5">{label}</label>}
      <div className="relative">
        {React.cloneElement(
          trigger ? (
            trigger
          ) : (
            <button
              className={
                'dropdownAction w-full focus:outline-none inputParent trans flex justify-between items-center space-x-2 p-3 cursor-pointer '
              }
            >
              <div className="dropdownAction cursor-pointer">{placeholder}</div>
              <div className="dropdownAction inline-flex items-center px-3 cursor-pointer ">
                <Icon
                  className="pointer-events-none"
                  name={active ? 'FaAngleUp' : 'FaAngleDown'}
                />
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
            'dropdownAction absolute max-h-32 w-full mt-1 overflow-auto flex flex-col shadow trans rounded origin-bottom-left z-40 bg-white dark:bg-gray-600 ' +
            (active
              ? 'opacity-100 scale-100 visible'
              : 'opacity-0 scale-75 hidden')
          }
          style={{
            minWidth: '120px',
          }}
        >
          {actions.map((item, i) => {
            return (
              <Item
                key={i}
                onClick={() => {
                  item.action()
                  setActive(false)
                }}
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

function Item({ ...props }) {
  return (
    <div
      className={
        'dropdownAction text-h5 cursor-pointer trans px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 trans'
      }
      {...props}
    >
      {props.children}
    </div>
  )
}
