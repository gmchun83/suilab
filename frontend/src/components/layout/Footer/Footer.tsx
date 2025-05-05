import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">© {currentYear} PumpSui - Meme Coin Launch Platform</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="text-gray-600 hover:text-primary-600">About</Link>
            <Link to="/faq" className="text-gray-600 hover:text-primary-600">FAQ</Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary-600">Terms</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-primary-600">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
