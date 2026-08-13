import React from 'react'

interface CardBodyProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const CardBody = React.memo(function CardBody({ children, style }: CardBodyProps) {
  return (
    <div style={style}>
      {children}
    </div>
  )
})
