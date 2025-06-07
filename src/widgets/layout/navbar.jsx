import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from '@material-tailwind/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import SubjectsFlyout from '../../components/subjects-flyout';
import InstallBtn from '@/components/install-btn';

export function Navbar({ brandName, routes }) {
  const [openNav, setOpenNav] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const navRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.onupdatefound = () => {
          setUpdateAvailable(true); // Notify the user when an update is available
        };
      });
    }
  }, []);

  const handleUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update(); // Force an update of the SW
      window.location.reload(); // Reload the page to apply the update
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // Cleanup listener
  }, []);

  const handleLinkClick = () => {
    setOpenNav(false); // Close the nav when a link is clicked
  };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon, href, target }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="inherit"
          className="capitalize"
        >
          {href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-2 font-bold hover:bg-blue-500 hover:text-white rounded transition duration-200"
              onClick={handleLinkClick}
            >
              {icon &&
                React.createElement(icon, {
                  className: 'w-[18px] h-[18px] opacity-75 mr-1',
                })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-2 font-bold hover:bg-blue-500 hover:text-white rounded transition duration-200"
              onClick={handleLinkClick}
            >
              {icon &&
                React.createElement(icon, {
                  className: 'w-[18px] h-[18px] opacity-75 mr-1',
                })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );

  const handleClickOutside = (event) => {
    // Verifica si el clic fue fuera del componente
    if (navRef.current && !navRef.current.contains(event.target)) {
      setOpenNav(false);
    }
  };

  useEffect(() => {
    // Agrega el listener al documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpia el listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
      console.log('Deferred Prompt saved:', e); // Add this log
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      console.log('Triggering prompt...');
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install');
        } else {
          console.log('User dismissed the PWA install');
        }
        setDeferredPrompt(null);
        setInstallable(false);
      });
    } else {
      console.log('No deferredPrompt available');
    }
  };

  useEffect(() => {
    if (!window.BeforeInstallPromptEvent) {
      console.log('Browser does not support beforeinstallprompt event');
      setInstallable(false);
    }
  }, []);

  return (
    <MTNavbar
      color="transparent"
      className="p-3 backdrop-blur-sm bg-black/40 bg-opacity-50"
    >
      <div className="container mx-auto flex items-center justify-between text-white">
        <Link to="/">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold text-2xl hover:text-blue-400 transition duration-300">
            {brandName}
          </Typography>
        </Link>
        {installable && (
          <InstallBtn
            id="install-btn"
            className="install-btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={handleInstallClick}
          />
        )}

        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex">
          <SubjectsFlyout maxHeight={'500px'} />
        </div>
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav} ref={navRef}>
        <div className="rounded-xl bg-blue-gray-900 px-4 pt-2 pb-4 text-white">
          <div className="container mx-auto">
            <SubjectsFlyout maxHeight={'200px'} />
            {navList}
          </div>
        </div>
      </Collapse>

      {updateAvailable && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded">
          <span>New update available!</span>
          <Button variant="gradient" size="sm" fullWidth onClick={handleUpdate}>
            Refresh to Update
          </Button>
        </div>
      )}
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: 'EduWeb',
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Navbar.displayName = '/src/widgets/layout/navbar.jsx';

export default Navbar;
