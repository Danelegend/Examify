import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from 'react-auth-kit'

import './index.css'
import Layout from './layout';
import ExamsPage from './Pages/ExamsPage';
import ExamPage from './Pages/ExamPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: "/",
    children: [
      {
        element: <ExamsPage />,
        path: "/exams",
      },
      {
        element: <ExamPage />,
        path: "/exam"
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider authType = {"cookie"}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={window.location.protocol === "https:"}>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
