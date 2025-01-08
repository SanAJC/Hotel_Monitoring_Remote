import { ReactNode } from 'react'
import '/src/styles/CardRoom.css'

export type CardRoomPropd ={
    title : string,
    children:ReactNode,
}

export const CardRoom = ({title,children}:CardRoomPropd) => {
  return (
    <div className="card-room">
      <h2>{title}</h2>
      <div className="card-content-room">
        {children}
      </div>
    </div>
  )
}
