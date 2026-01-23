import { Providers } from './app/providers'
import { RouterProvider } from 'react-router'
import { router } from './app/router'

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
