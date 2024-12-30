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

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomepageLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
        loader: async () => ReqPublicBook({limit: 20})
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
        }
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
