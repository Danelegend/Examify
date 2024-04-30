import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css'
import Layout from './layout';
import ExamsPage from './Pages/ExamsPage';
import ExamPage from './Pages/ExamPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UploadPage from './Pages/UploadPage';
import ContactPage from './Pages/ContactPage';
import AboutPage from './Pages/AboutPage';
import StudentDashboardPage from './Pages/StudentDashboardPage';
import { AdminProtectedRoute, ProtectedRoute } from './util/ProtectedRoute';
import { useState } from 'react';
import { readAccessToken } from './util/utility';
import { UserContext } from './context/user-context';

import { GoogleOAuthProvider } from '@react-oauth/google';
import AdminPage from './Pages/Admin';
import AdminCurrentExamPage from './Pages/Admin/CurrentExamPage';
import AdminReviewExamPage from './Pages/Admin/ReviewExamPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <AboutPage />,
        path: "",
      },
      {
        element: <ExamsPage />,
        path: "exams",
      },
      {
        element: <UploadPage />,
        path: "upload",
      },
      {
        element: <ContactPage />,
        path: "contact",
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <StudentDashboardPage />,
            path: "dashboard",
          }
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "admin",
            element: <AdminProtectedRoute />,
            children: [
              {
                element: <AdminPage />,
                path: "",
              },
              {
                path: "exams",
                children: [
                  {
                    element: <AdminCurrentExamPage />,
                    path: "current"
                  },
                  {
                    element: <AdminReviewExamPage />,
                    path: "review"
                  }
                ]
              }
            ],
          }
        ]
      }
    ],
  },
  {
    element: <ExamPage />,
    path: "/exam/:school/:year/:exam_type"
  }
])

const queryClient = new QueryClient()

const App = () => {
  const [accessToken, setAccessToken] = useState(readAccessToken())

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={"623177653931-inec93uqarv00qs0gvtdd1lrvbekic62.apps.googleusercontent.com"}> 
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
