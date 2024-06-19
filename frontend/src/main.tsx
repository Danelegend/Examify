import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css'
import Layout from './layout';
import { ExamsPage, SubjectExamsPage } from './Pages/ExamsPage';
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
import NotFoundPage from './Pages/NotFoundPage';
import PrivacyPage from './Pages/PrivacyPage';
import TosPage from './Pages/TosPage';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
        element: <SubjectExamsPage />,
        path: "exams/:subject"
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
        element: <PrivacyPage />,
        path: "privacy",
      },
      {
        element: <TosPage />,
        path: "tos"
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
    path: "/exam/:subject/:school/:year/:exam_type"
  },
  {
    element: <NotFoundPage />,
    path: "*"
  }
])

const queryClient = new QueryClient()

const App = () => {
  const [accessToken, setAccessToken] = useState(readAccessToken())

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={"623177653931-inec93uqarv00qs0gvtdd1lrvbekic62.apps.googleusercontent.com"}> 
        <UserContext.Provider value={{ accessToken, setAccessToken }}>
          <HelmetProvider>
            <Helmet>
              <title>Examify | Comprehensive HSC Study Platform</title>
            </Helmet>
            <RouterProvider router={router} />
          </HelmetProvider>
        </UserContext.Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
