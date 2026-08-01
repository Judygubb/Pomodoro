import { useState } from 'react'
import './css/index.css'
import './css/home_page.css'

function App() {

  return (
    <>
      <div className="background">
        <div className="pomodoro-container"> 

          <div className="tomato">
            <h1 className="timer">00:00</h1>
          </div>
          
          <div className="buttons">
            <button className="button button-back"></button>

            <button className="button button-play"></button>
            
            <button className="button button-skip"></button>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
