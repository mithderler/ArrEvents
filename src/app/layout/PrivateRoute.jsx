import React from 'react';
import { useSelector } from 'react-redux';
import UnauthModal from '../../features/auth/UnauthModal';

export default function PrivateRoute({ defaultElement: Component, ...rest }) {
  const { authenticated } = useSelector((state) => state.auth);

  return authenticated ? <Component {...rest} /> : <UnauthModal {...rest} />;
}
