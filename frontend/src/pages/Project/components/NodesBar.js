import Icon from 'components/Icon'
import React from 'react'

function NodesBar() {
  const onDragStart = (event, nodeType, argumentFor) => {
    console.log('dragging')
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('text/plain', argumentFor)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      className="absolute flex rounded-full justify-around bg-white dark:bg-gray-700 shadow-lg dark:border-none overflow-hidden"
      style={{
        zIndex: '100',
        bottom: '20px',
        left: '50%',
        transform: 'translate(-50%)',
      }}
    >
      <div className=""></div>
      <div
        draggable={true}
        className="flex p-4 dndnode QUESTION cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'QUESTION')}
      >
        <Icon
          title="question"
          size={30}
          name={'FaQuestion'}
          color="#fce71e"
          className="m-auto"
        />
      </div>
      <div
        draggable={true}
        className="flex p-4 dndnode IDEA cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'IDEA')}
      >
        <Icon
          title="idea"
          size={30}
          name={'FaLightbulb'}
          color="#F59E0B"
          className="m-auto"
        />
      </div>
      <div
        draggable={true}
        className="flex p-4 dndnode ACTION cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'ACTION')}
      >
        <Icon
          title="action"
          size={30}
          name={'FaArrowsAlt'}
          color="#818CF8"
          className="m-auto"
        />
      </div>
      <div
        draggable={true}
        className="flex p-4 dndnode ARGUMENT cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'ARGUMENT', true)}
      >
        <Icon
          title="argument for"
          size={30}
          name={'FaCheck'}
          color="#10B981"
          className="m-auto"
        />
      </div>
      <div
        draggable={true}
        className="flex p-4 dndnode ARGUMENT cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'ARGUMENT', false)}
      >
        <Icon
          title="argument against"
          size={30}
          name={'FaTimes'}
          color="#EF4444"
          className="m-auto"
        />
      </div>
      <div
        draggable={true}
        className="flex p-4 dndnode CONSTRAINT cursor-pointer trans hover:bg-gray-200 dark:hover:bg-gray-500"
        onDragStart={(event) => onDragStart(event, 'CONSTRAINT')}
      >
        <Icon
          title="constraint"
          size={30}
          name={'FaExclamationTriangle'}
          className="m-auto"
        />
      </div>
    </div>
  )
}

export default NodesBar
