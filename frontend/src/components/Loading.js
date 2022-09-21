import React from 'react'

export default function Loading({ radius }) {
  return (
    <div
      className={`loader absolute m-auto w-${radius || '4'} h-${radius || '4'}`}
    ></div>
  )
}
