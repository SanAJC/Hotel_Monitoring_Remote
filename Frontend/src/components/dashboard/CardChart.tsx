import { ReactNode } from 'react'
import '/src/styles/Card.css'

export type CardPropd ={
    title : string,
    children:ReactNode,
}

export const CardChart = ({title,children}:CardPropd) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}
