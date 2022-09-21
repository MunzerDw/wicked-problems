import Icon from 'components/Icon'
import React, { useState } from 'react'

const Table = (props) => {
  return (
    <div
      className={'w-full flex flex-col space-y-2 overflow-auto relative'}
      style={{
        minWidth: '1000px',
      }}
    >
      {props.children}
    </div>
  )
}

const Head = (props) => {
  let cols = props.children.reduce(
    (x, child) => (child instanceof Array ? child.length + x : 1 + x),
    0
  )
  return (
    <div
      className={`sticky top-0 w-full p-4 grid gap-x-8 break-words text-h4 rounded ${props.className}`}
      style={{
        ...props.style,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {props.children}
    </div>
  )
}

const Body = (props) => {
  return <div className={'w-full flex flex-col'}>{props.children}</div>
}

const RowGroup = (props) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      {React.cloneElement(props.children[0], {
        leftControl: (
          <Icon name={expanded ? 'faMinusCircle' : 'faPlusCircle'} />
        ),
        className: 'font-medium cursor-pointer',
        onClick: (e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        },
      })}
      <div
        className={`flex flex-col space-y-2 trans bg-gray-300 border-t-2 border-gray-900 ${
          !expanded && 'strictNoMarginTop'
        } ${props.className}`}
        style={{
          opacity: expanded ? '1' : '0',
          maxHeight: expanded ? '500px' : '0px',
          overflow: 'hidden',
          ...props.style,
        }}
      >
        {props.children.slice(1)}
      </div>
    </>
  )
}

const Row = (props) => {
  const [expanded, setExpanded] = useState(false)
  let cols = props.children.reduce(
    (x, child) => (child instanceof Array ? child.length + x : 1 + x),
    0
  )
  return (
    <div
      className={
        'w-full flex flex-col trans ' + (expanded && 'border-secondary-400')
      }
    >
      <div
        className={`w-full grid gap-x-8 p-4 border-b border-secondary-300 ${
          props.className
        } ${
          props.onClick || props.expanded
            ? 'trans hover:bg-gray-300 cursor-pointer'
            : ''
        } ${expanded ? 'bg-gray-300' : ''} `}
        onClick={(e) => {
          props.onClick && props.onClick(e)
          if (props.expanded) {
            setExpanded(!expanded)
          }
        }}
        style={{
          ...props.style,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {
          <>
            <div className="flex space-x-2 whitespace-pre-line">
              {props.leftControl}
              {props.children[0]}
            </div>
            {props.children.slice(1)}
          </>
        }
      </div>

      <div
        className="w-full trans overflow-auto"
        style={{
          maxHeight: expanded ? '1500px' : '0px',
          opacity: expanded ? '1' : '0',
        }}
      >
        {props.expanded}
      </div>
    </div>
  )
}

const Cell = (props) => {
  return (
    <div
      className={`flex space-x-2 items-center whitespace-pre-line ${props.className}`}
      {...props}
    >
      {props.children}
    </div>
  )
}

Table.Body = Body
Table.Row = Row
Table.Cell = Cell
Table.Head = Head
Table.RowGroup = RowGroup
export default Table
