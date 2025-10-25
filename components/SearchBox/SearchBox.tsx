import React, { useState } from 'react'
import css from './SearchBox.module.css'
import { useDebouncedCallback } from 'use-debounce'

type Props = {
  onSearch: (search: string) => void
}

const SearchBox = ({ onSearch }: Props) => {
  const [value, setValue] = useState('')

  const debounced = useDebouncedCallback((value) => {
    onSearch(value)
  }, 400)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.trim())
    debounced(e.target.value.trim())
  }

  return (
    <>
      <input
        type="text"
        className={css.input}
        value={value}
        placeholder="Search notes"
        onChange={handleChange}
      />
    </>
  )
}

export default SearchBox
