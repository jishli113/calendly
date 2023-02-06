
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { createContext, useState } from 'react';
import {
  BrowserRouter,
  Routes, 
  Route,
  Router
} from "react-router-dom";
import Feed from './components/feed';
import Social from './components/Social'
import Landing from './components/Landing'
import Settings from './components/settings';
import Events from './components/Events';
import Register from './components/register'
import LoginCheck from './components/LoginCheck'

function App() {


  // const [globalLoggedIn, setGlobalLoggedIn] = setState()


  // useEffect(()=>{
  //   setGlobalLoggedIn
  // })

  

  return(
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route exact path="/" element={<LoginCheck element={<Feed/>}/>}/>
        <Route path='/social' element={<LoginCheck element = {<Social/>}/>}/>
        <Route path='/settings' element={<LoginCheck element = {<Settings/>}/>}/>
        <Route path='/events' element={<LoginCheck element = {<Events/>}/>}/>
        <Route path='/landing' element ={<Landing/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
  </div>
  </BrowserRouter>
  )

}

export default App;
