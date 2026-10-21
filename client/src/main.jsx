import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import Main from './layouts/Main.jsx'
import App from './App.jsx'
import Details from './pages/Details.jsx'
import Edit from './pages/Edit.jsx'
import PostCreate from './pages/PostCreate.jsx'
import AuthPage from './pages/AuthPage.jsx'
import { UserContextProvider } from './UserContext.jsx'
import { checkLogin } from './utils/checkLogin.js'
import Profile from './pages/Profile.jsx'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Main />,
    children : [
      {
        index : true,
        element : <App />
      },
      {
        path : "/auth",
        element : <AuthPage />
      },
      {
        path : "/profile",
        element : <Profile />
      },
      {
        path : "/details/:id",
        element : <Details />
      },
      {
        path : "/post-create",
        element : <PostCreate />,
        loader : checkLogin
      },
      {
        path : "/edit/:id",
        element : <Edit />,
        loader : checkLogin
      }
    ]
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router}/>
    </UserContextProvider>
  </StrictMode>,
)
