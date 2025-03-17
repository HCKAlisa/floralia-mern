import './App.css'
import { Route, Routes } from 'react-router-dom';

import Home from "./pages/home"
import signin from "./pages/admin/signin"

function App() {

  return (
      <Routes>
          <Route path="/" Component={Home}/>
          <Route path="/admin/signin" Component={signin}/>
      </Routes>
  )
}

export default App
