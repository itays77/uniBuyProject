import { Link } from 'react-router-dom';
import MainNav from './MainNav';

const header = () => {
  return (
    <div className="border-b-2 border-b-gray-900 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          className="text-3xl font-bold text-gray-900"
          to="/"
        >
          uniBuy
        </Link>
        <div >
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default header;
