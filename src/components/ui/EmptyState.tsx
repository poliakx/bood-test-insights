import React from 'react'

type EmptyStateProps = {
  title?: string
  message?: string
  className?: string
}

export default function EmptyState({
  title,
  message = 'No data.',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500 ${className}`.trim()}>
      {title ? <h3 className="text-base font-semibold text-gray-900">{title}</h3> : null}
      <p className={title ? 'mt-1' : ''}>{message}</p>
    </div>
  )
}
