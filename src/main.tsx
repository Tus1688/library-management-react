import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomepageLayout from './HomepageLayout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ThemeProvider } from './components/theme-provider.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomepageLayout />,
    children: [
      {
        index: true,
        element: <h1>this is index</h1>
      },
      {
        path: "/bla",
        element: <div>bla</div>
      }
    ]
  },
  {
    path: '/login',
    element: <div>login</div>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
