import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ children, type = 'button', ...rest }: Props) {
  return (
    <button type={type} {...rest}>
      {children}
    </button>
  )
}
