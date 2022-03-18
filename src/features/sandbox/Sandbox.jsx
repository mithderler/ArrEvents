import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { openModal } from '../../app/common/modals/modalReducer';
import TestPlaceInput from './TestPlaceInput';

import { increment, decrement } from './testReducer';

const Sandbox = () => {
  const data = useSelector((state) => state.test.data);
  const dispatch = useDispatch();
  const [target, setTarget] = useState(null);

  const { loading } = useSelector((state) => state.async);

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
  const [location, setLocation] = useState(defaultProps);

  function handleSetLocation(latLng) {
    setLocation({ ...location, center: latLng });
  }

  return (
    <>
      <h1>Testing</h1>
      <h3>The data is: {data}</h3>
      <Button
        name='increment'
        loading={loading && target === 'increment'}
        onClick={(e) => {
          dispatch(increment(20));
          setTarget(e.target.name);
        }}
        content='Increment'
        color='green'
      />
      <Button
        name='decrement'
        loading={loading && target === 'decrement'}
        onClick={(e) => {
          dispatch(decrement(10));
          setTarget(e.target.name);
        }}
        content='Decrement'
        color='red'
      />
      <Button
        onClick={() =>
          dispatch(openModal({ modalType: 'TestModal', modalProps: { data } }))
        }
        content='Open Modal'
        color='teal'
      />
      <div style={{ marginTop: 15 }}>
        <TestPlaceInput setLocation={handleSetLocation} />
        {/* <TestMap location={location} /> */}
      </div>
    </>
  );
};

export default Sandbox;
