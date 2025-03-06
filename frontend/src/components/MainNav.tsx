import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ui/button';
import UsernameMenu from './UsernameMenu';
import CartIcon from './CartIcon.tsx';

const MainNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <span className="flex items-center space-x-2">
      <CartIcon />

      {isAuthenticated ? (
        <UsernameMenu />
      ) : (
        <Button
          variant="ghost"
          className="font-bold hover:text-gray-800 hover:bg-white"
          onClick={async () => await loginWithRedirect()}
        >
          Log In
        </Button>
      )}
    </span>
  );
};

export default MainNav;
