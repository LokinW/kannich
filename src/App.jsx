import { useState } from 'react'
import './App.css'
import LocationChecker from './components/LocationChecker.jsx'
import Header from './components/Header.jsx'
import styles from "./App.module.css"

function App() {

  return (
    <>
      <div className={styles.hero}>
        <Header />
        <LocationChecker />
      </div>
    </>
  )
}

export default App
