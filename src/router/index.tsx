import { ErrorBoundaryLayout, LoadingOverlay } from '@fluxu-labs/lib';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Appbar } from 'src/components/Appbar';

// ----------------------------------------------------------------------

const CTe = lazy(() => import('src/pages/CTe'));

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingOverlay />}>
            <Appbar />
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            path: '',
            element: <CTe />,
          },
        ],
      },
    ],
  },
]);

// ----------------------------------------------------------------------

export function Router() {
  return <RouterProvider router={router} />;
}
