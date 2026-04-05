import { RouterProvider } from 'react-router';
import { getRouter } from './routes';

export default function App() {
  return <RouterProvider router={getRouter()} />;
}
