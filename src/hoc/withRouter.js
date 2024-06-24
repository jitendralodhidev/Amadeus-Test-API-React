// Importing React and external libs
import React from 'react';

import {
  BrowserRouter,
  useInRouterContext,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

export const withRouter = (Component) => {
  return (props) => {
    if (!useInRouterContext()) {
      console.warn('Not able to add router to component:', Component.prototype);
      return <BrowserRouter>
        <Component router={{
          navigate: (url) => url === -1 ? window.history.back() : window.location.assign(url)
        }} {...props} />
      </BrowserRouter>;
    }
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  };
};