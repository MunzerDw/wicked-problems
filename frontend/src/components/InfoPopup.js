import { useState, useRef } from 'react'
import SimpleButton from './SimpleButton'
import useOutsideAlerter from 'hooks/useOutsideAlerter'

function InfoPopup({ text, icon, className, onClick, expandDown, ...props }) {
  const [active, setActive] = useState(false)
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef, () => {
    setActive(false)
  })
  return (
    <div ref={wrapperRef} className="">
      {active && (
        <div
          className="absolute max-w-96 p-2 bg-white dark:bg-gray-700 rounded shadow-lg fadeIn space-y-2"
          style={{
            top: '10%',
            zIndex: '9000',
            minWidth: '200px',
            left: '50%',
            transform: 'translate(-50%)',
          }}
        >
          {props.children}
        </div>
      )}
      <div
        className={
          'cursor-default opacity-75 hover:opacity-100 relative flex items-center ' +
          className
        }
      >
        <SimpleButton
          active={true}
          iconRight={true}
          text={text}
          icon={icon || 'FaExclamationCircle'}
          onClick={(e) => {
            setActive(!active)
            onClick && onClick(e)
          }}
        />
      </div>
    </div>
  )
}
export default InfoPopup
