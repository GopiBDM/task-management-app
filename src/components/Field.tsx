import type { InputHTMLAttributes } from 'react'

type Props = { label: string; id: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>

// One consistent look for every text input in the app.
export const inputClass =
  'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/15'

export default function Field({ label, id, hint, ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {props.required && <span className="text-red-600"> *</span>}
      </label>
      <input id={id} name={id} className={inputClass} {...props} />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  )
}
