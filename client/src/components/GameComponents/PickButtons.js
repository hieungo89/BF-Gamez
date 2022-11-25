import React from 'react'

const PickButtons = ({ steal, pickSteal, playerOrder, currentPlayer }) => {

  const onClick = (opponent) => {
    steal(pickSteal, opponent);
  }
  console.log('-->', playerOrder, currentPlayer)
  return (
    <div
    className='absolute h-full w-full flex justify-center items-center'>
      <div className='bg-slate-100 p-10 rounded-xl flex flex-col justify-center items-center gap-5'>
        Pick a player to steal from
        <div className='flex gap-6'>
          {playerOrder.map((player) => {
            if(player === currentPlayer){
              return null;
            } else {
              return <button
              key={player}
              className='rounded-full w-20 h-20 text-5xl bg-red-500 flex justify-center items-center'
              onClick={()=>onClick(player)}
              >{player}</button>
            }
          })}
        </div>
      </div>

    </div>
  )
}

export default PickButtons
