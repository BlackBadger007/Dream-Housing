import{BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Offer from './pages/Offer'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Property from './pages/Property'
import Chat from './pages/Chat'
import Navbar from './components/Navbar'
import Search from './pages/Search'
import Message from './pages/Message'
import PrivateRoute from './components/PrivateRoute'
import { HousingProvider } from './context/HousingContext'
import './index.css'
import './firebase.config'

function App() {
  return (

    
    <HousingProvider>
      <Router>
      <Routes>
        <Route path='/' element={<Explore/>} />
        
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/offer' element={<Offer/>} />

        <Route path='/profile' element={<PrivateRoute/>} >
          <Route path='/profile' element={<Profile/>} />
        </Route>

        <Route path='/message/:receiver' element={<PrivateRoute/>} >
          <Route path='/message/:receiver' element={<Message/>} />
        </Route>

        <Route path='/chats/' element={<PrivateRoute/>} >
          <Route path='/chats/' element={<Chat/>} />
        </Route>

        <Route path='/createListing' element={<PrivateRoute/>} >
          <Route path='/createListing' element={<CreateListing/>} />
        </Route>

        <Route path='/property/:productId' element={<PrivateRoute/>} >
          <Route path='/property/:productId' element={<Property/>} />
        </Route>

        <Route path='/sign-in' element={<SignIn/>} />
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/category/:login' element={<Category/>} />

      </Routes>
    </Router>
    </HousingProvider>

  )
}

export default App