import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { useRouter } from 'next/router';

function checkAuth<P>(
  component: (props: P) => JSX.Element,
  props: P,
  showOnAuth = true,
  fallback = '/'
) {
  return function Check(): JSX.Element {
    const auth = useContext(AuthContext);
    const router = useRouter();
    const [loading, isLoading] = useState(true);
    const isAuthenticated = auth.isAuthenticated();

    useEffect(() => {
      (async () => {
        if (showOnAuth && !isAuthenticated) {
          // Auth required but not authenticated.
          await router.replace(fallback);
        } else if (!showOnAuth && isAuthenticated) {
          // Auth not required but is authenticated.
          await router.replace(fallback);
        }
        isLoading(false);
      })();
    }, [isAuthenticated]);

    return <>{!loading && component(props)}</>;
  };
}

export default checkAuth;
