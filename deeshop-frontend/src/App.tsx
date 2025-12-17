import { Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import Interview from './pages/Interview'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </>
  )
}

export default App
