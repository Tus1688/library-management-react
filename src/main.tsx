import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomepageLayout from './routes/HomepageLayout.tsx'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ReqPublicBook } from './routes/api.ts'
import Homepage from './routes/Homepage.tsx'
import AdminLayout from './routes/admin/AdminLayout.tsx'
import { authStatus } from './lib/utils.ts'
import LoginPage from './routes/login/LoginPage.tsx'
import { ReqBooking } from './routes/admin/booking/api.ts'
import BookingPage from './routes/admin/booking/BookingPage.tsx'
import BookPage from './routes/admin/books/BookPage.tsx'
import RootErrorPage from './components/root-error-page.tsx'
import { ReqGetEmployee } from './routes/admin/employee/api.ts'
import EmployeePage from './routes/admin/employee/EmployeePage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomepageLayout />,
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        element: <Homepage />,
        loader: async () => ReqPublicBook({ limit: 20 })
      },
      {
        path: "/auth/login",
        element: <LoginPage />,
        loader: () => {
          if (authStatus()) {
            return redirect("/admin")
          }

          return null;
        },
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        loader: () => {
          if (!authStatus()) {
            return redirect("/auth/login")
          }
          return null;
        },
        children: [
          {
            index: true,
            element: <BookingPage />,
            loader: async () => ReqBooking({ limit: 20 })
          },
          {
            path: "book",
            element: <BookPage />,
            loader: async () => ReqPublicBook({ limit: 20 })
          },
          {
            path: "employee",
            element: <EmployeePage />,
            loader: async() => ReqGetEmployee()
          }
        ]
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
