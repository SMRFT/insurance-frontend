import React from 'react'
import Select from 'react-select'

/**
 * SearchableSelect Component
 * A drop-in replacement for native <select> elements with live search functionality.
 */
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '38px',
    height: '38px',
    borderRadius: '6px',
    borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#94a3b8',
    },
    fontSize: '14px',
    backgroundColor: state.isDisabled ? '#f8fafc' : '#ffffff',
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: '36px',
    padding: '0 8px',
  }),
  input: (provided) => ({
    ...provided,
    margin: '0px',
    padding: '0px',
    color: '#0f172a',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#0f172a',
    fontSize: '14px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#94a3b8',
    fontSize: '14px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#0284c7'
      : state.isFocused
      ? '#e0f2fe'
      : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#0f172a',
    fontSize: '14px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#0284c7',
      color: '#ffffff',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
}

const SearchableSelect = ({
  name,
  value,
  onChange,
  options = [],
  children,
  placeholder = "Search & select...",
  disabled,
  isDisabled,
  isClearable = true,
  style,
  className,
}) => {
  let formattedOptions = []

  if (Array.isArray(options) && options.length > 0) {
    formattedOptions = options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? String(opt.value) : String(opt.label || ''),
          label: String(opt.label || opt.value || ''),
        }
      }
      return { value: String(opt), label: String(opt) }
    })
  } else if (children) {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const val = child.props.value !== undefined ? String(child.props.value) : ''
        const lbl = child.props.children ? String(child.props.children) : val
        if (val !== '') {
          formattedOptions.push({ value: val, label: lbl })
        }
      }
    })
  }

  const currentValStr = value !== undefined && value !== null ? String(value) : ''
  const selectedOption = formattedOptions.find((opt) => opt.value === currentValStr) || null

  const handleChange = (selected) => {
    const newValue = selected ? selected.value : ''
    const syntheticEvent = {
      target: {
        name: name,
        value: newValue,
      },
    }
    if (typeof onChange === 'function') {
      onChange(syntheticEvent)
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0, ...style }} className={className}>
      <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={formattedOptions}
        placeholder={placeholder}
        isDisabled={disabled || isDisabled}
        isClearable={isClearable}
        isSearchable={true}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </div>
  )
}

export default SearchableSelect
