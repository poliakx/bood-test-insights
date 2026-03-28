import React from 'react'

type ErrorStateProps = {
  title?: string
  message?: string
  className?: string
}

export default function ErrorState({
  title,
  message = 'An error occurred.',
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 ${className}`.trim()}
    >
      {title ? <h3 className="text-base font-semibold text-red-800">{title}</h3> : null}
      <p className={title ? 'mt-1' : ''}>{message}</p>
    </div>
  )
}
