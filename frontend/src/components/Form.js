import React from 'react'

function Form({ onSubmit, className, children }) {
  return (
    <form
      className={`rounded p-6 px-8 space-y-6 w-full ${className}`}
      style={{
        maxWidth: '400px',
      }}
      onSubmit={async (e) => {
        e.preventDefault()
        onSubmit && onSubmit(e)
      }}
    >
      {children}
    </form>
  )
}

export default Form
