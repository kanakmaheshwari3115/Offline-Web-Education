import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/widgets/layout';
import AppRoutes from './routes';
import routes from './routes/routes';
import NetworkStatus from './components/NetworkStatus';

function App() {
  const { pathname } = useLocation();
  const [showSyncButton, setShowSyncButton] = useState(false);

  const handleUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      window.location.reload();
    }
  };

  useEffect(() => {
    const updateSyncButton = () => setShowSyncButton(!navigator.onLine);
    updateSyncButton();
    window.addEventListener('online', updateSyncButton);
    window.addEventListener('offline', updateSyncButton);
    return () => {
      window.removeEventListener('online', updateSyncButton);
      window.removeEventListener('offline', updateSyncButton);
    };
  }, []);

  return (
    <>
      <NetworkStatus />

      {showSyncButton && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl shadow-md hover:bg-yellow-600 transition"
          >
            Reconnect & Sync
          </button>
        </div>
      )}

      {!(pathname === '/sign-in' || pathname === '/sign-up') && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={routes} />
        </div>
      )}

      <AppRoutes />
    </>
  );
}

export default App;
