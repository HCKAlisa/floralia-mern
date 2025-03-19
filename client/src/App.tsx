import './App.css'
import { Route, Routes } from 'react-router-dom';

import Home from "./pages/home"
import signin from "./pages/admin/signin"
import admin from "./pages/admin/index"
import PrivateRoute from "./components/privateRoute.tsx";

function App() {

  return (
      <Routes>
          <Route path="/" Component={Home}/>
          <Route path="/admin/signin" Component={signin}/>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" Component={admin}/>
          </Route>
      </Routes>
  )
}

export default App
