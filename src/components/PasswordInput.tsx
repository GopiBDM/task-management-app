'use client'

import { useState } from 'react'
import { inputClass } from './Field'

type Props = {
  label: string
  id: string
  hint?: string
  autoComplete?: string
  minLength?: number
}

export default function PasswordInput({ label, id, hint, autoComplete, minLength }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label} <span className="text-red-600">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className={`${inputClass} pr-16`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 px-3.5 text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  )
}
