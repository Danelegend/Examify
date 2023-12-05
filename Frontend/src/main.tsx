import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
        path: "/exam/:school/:type/:year"
      }
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
