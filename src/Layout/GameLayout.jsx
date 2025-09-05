import React from 'react'
import GameHeader from '../components/GameHeader'
import { Outlet } from 'react-router-dom'
import BottomNavBar from '../components/BottomNavBar'

function GameLayout() {
  return (
     <div className="layout-wrapper">
      <GameHeader />
      <main className="main-content with-bottom-padding">
        <Outlet />
      </main>
      <BottomNavBar />
    </div>
  )
}

export default GameLayout