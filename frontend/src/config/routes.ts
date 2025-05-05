export interface Route {
  path: string;
  name: string;
  exact?: boolean;
  auth?: boolean;
  component: string;
}

export const routes: Route[] = [
  {
    path: '/',
    name: 'Home',
    exact: true,
    component: 'Home',
  },
  {
    path: '/create',
    name: 'Create Coin',
    component: 'CreateCoin',
    auth: true,
  },
  {
    path: '/coins/:id',
    name: 'Coin Details',
    component: 'CoinDetails',
  },
  {
    path: '/explore',
    name: 'Explore',
    component: 'Explore',
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: 'Portfolio',
    auth: true,
  },
  {
    path: '/dashboard',
    name: 'Creator Dashboard',
    component: 'CreatorDashboard',
    auth: true,
  },
  {
    path: '/wallet',
    name: 'Wallet Connection',
    component: 'WalletConnection',
  },
  {
    path: '/profile',
    name: 'User Profile',
    component: 'UserProfile',
    auth: true,
  },
  {
    path: '/about',
    name: 'About',
    component: 'About',
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: 'FAQ',
  },
  {
    path: '/contact',
    name: 'Contact',
    component: 'Contact',
  },
  {
    path: '/terms',
    name: 'Terms',
    component: 'Terms',
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: 'Privacy',
  },
];

export const navLinks = routes.filter(route => 
  ['Home', 'Explore', 'Create Coin', 'Portfolio', 'Creator Dashboard'].includes(route.name)
);

export default routes;
