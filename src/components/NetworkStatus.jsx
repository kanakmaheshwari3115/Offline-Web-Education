import { useEffect, useState } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`text-white text-sm px-4 py-2 text-center font-medium ${isOnline ? 'bg-green-600' : 'bg-red-600'}`}>
      {isOnline ? 'You are online' : 'You are offline — working in local mode'}
    </div>
  );
};

export default NetworkStatus;
