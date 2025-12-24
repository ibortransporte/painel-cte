import { ErrorBoundaryLayout, LoadingOverlay } from '@fluxu-labs/lib';
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { Appbar } from 'src/components/Appbar';
import { AuthGuard } from 'src/guards/AuthGuard';

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
          <AuthGuard>
            <Suspense fallback={<LoadingOverlay />}>
              <Appbar />
              <Outlet />
            </Suspense>
          </AuthGuard>
        ),
        children: [
          {
            path: '',
            element: <CTe />,
          },
        ],
      },

      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

// ----------------------------------------------------------------------

export function Router() {
  return <RouterProvider router={router} />;
}
