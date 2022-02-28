import React from 'react'
import BaseInputProps from './BaseInputProps'


export interface RangeInputProps extends BaseInputProps {
  defaultValue: number
  min?: number
  max?: number
}

export default function RangeInput(data: RangeInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    data.onChange(e.target.value)
    e.preventDefault()
  }

  return (
    <input
      className="w-full py-2 px-1"
      type="range"
      min={data.min}
      max={data.max}
      defaultValue={data.defaultValue}
      id={data.title}
      onChange={handleChange}
    />
  )
}
