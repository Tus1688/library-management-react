import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomepageLayout from './HomepageLayout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ThemeProvider } from './components/theme-provider.tsx'
import { ReqPublicBook } from './routes/api.ts'
import Homepage from './routes/Homepage.tsx'

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
