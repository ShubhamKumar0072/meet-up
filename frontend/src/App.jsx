import './App.css'
import LandingPage from './pages/LandingPage'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MyPrfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import Settings from './pages/Settings'

function App() {

  return (
    <div className="app">
      <Navbar></Navbar>
      <div className="pages">
        
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Home/profile' element={<MyPrfile/>}/>
          <Route path='/Home/chatpage' element={<ChatPage/>}/>
          <Route path='/Home/setting' element={<Settings/>}/>
        </Routes>


      </div>
    </div>
    // <>
    //   <Navbar/>
    //   <LandingPage/>
    // </>
  )
}

export default App
