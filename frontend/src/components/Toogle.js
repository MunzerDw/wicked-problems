import React from 'react'

function Toogle({ onChange, checked, ...props }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          checked={checked}
          id="toogleA"
          type="checkbox"
          className="hidden"
          onChange={(e) => onChange(e.target.checked)}
          {...props}
        />
        <div className="toggle__line my-auto w-10 h-4 bg-gray-100 dark:bg-gray-600 rounded-full shadow-inner"></div>
        <div className="toggle__dot m-auto trans absolute w-6 h-6 bg-gray-300 rounded-full shadow inset-y-0 left-0"></div>
      </div>
    </label>
  )
}

export default Toogle
