import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Header, Footer } from './components/layout';
import routes from './config/routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/ToastProvider';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const CreateCoin = lazy(() => import('./pages/CreateCoin'));
const CoinDetails = lazy(() => import('./pages/CoinDetails'));
const Explore = lazy(() => import('./pages/Explore'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const WalletConnection = lazy(() => import('./pages/WalletConnection'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));

// Map component names to their imports
const componentMap: Record<string, React.ComponentType<any>> = {
  Home,
  CreateCoin,
  CoinDetails,
  Explore,
  Portfolio,
  CreatorDashboard,
  WalletConnection,
  UserProfile,
  About,
  FAQ,
  Contact,
  Terms,
  Privacy,
};

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="container mx-auto py-8 flex-grow">
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <Routes>
                  {routes.map((route) => {
                    const Component = componentMap[route.component];
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <ErrorBoundary>
                            <Component />
                          </ErrorBoundary>
                        }
                      />
                    );
                  })}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
