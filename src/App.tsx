import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.css'
import { BrowserRouter, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import HomePage from './components/HomePage'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Route path="/" exact component={HomePage} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <Route path="/profile/:id" exact component={Profile} />
    </BrowserRouter>
  )
}

export default App
