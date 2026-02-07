import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Profile from './pages/profile'
import Settings from './pages/settings'
import Logout from './pages/logout'
import ForgotPassword from './pages/forgotPassword'
import ResetPassword from './pages/resetPassword'
import VerifyEmail from './pages/verifyEmail'
import Wallet from './pages/wallet'


export default function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/settings" element={<Settings />}/>
      <Route path="/logout" element={<Logout />}/>
      <Route path="/forgotPassword" element={<ForgotPassword />}/>
      <Route path="/resetPassword" element={<ResetPassword />}/>
      <Route path="/verifyEmail" element={<VerifyEmail />}/>
      <Route path="/wallet" element={<Wallet />}/>
    </Routes>
    
    
    
    
    </BrowserRouter>
  )
}