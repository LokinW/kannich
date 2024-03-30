import { useState } from 'react'
import './App.css'
import LocationChecker from './components/LocationChecker.jsx'
import Header from './components/Header.jsx'

function App() {

  return (
    <>
      <Header />
      <LocationChecker />
    </>
  )
}

export default App
