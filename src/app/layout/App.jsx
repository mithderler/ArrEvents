import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import NavBar from '../../features/nav/NavBar';
import HomePage from '../../features/home/HomePage';
import EventDashboard from '../../features/events/eventDashboard/EventDashboard';
import EventForm from '../../features/events/eventForm/EventForm';
import EventDetailedPage from '../../features/events/eventDetailed/EventDetailedPage';
import './style.css';
import ModalManager from '../common/modals/ModalManager';
import { ToastContainer } from 'react-toastify';
import ErrorComponent from '../common/errors/ErrorComponent';
import AccountPage from '../../features/auth/AccountPage';
import { useSelector } from 'react-redux';
import LoadingComponent from './LoadingComponent';
import ProfilePage from '../../features/profiles/profilePage/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {
  const { key } = useLocation();
  const { initialized } = useSelector((state) => state.async);

  if (!initialized) return <LoadingComponent content='Loading app..' />;

  return (
    <>
      <ModalManager />
      <ToastContainer
        position='bottom-right'
        hideProgressBar
        autoClose={3000}
      />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path={'/*'}
          element={
            <>
              <Container className='main'>
                <NavBar />
                <Routes>
                  <Route path='/events' element={<EventDashboard />} />
                  <Route path='/events/:id' element={<EventDetailedPage />} />
                  <Route
                    path='/createEvent'
                    element={<PrivateRoute defaultElement={EventForm} />}
                    key={key}
                  />
                  <Route
                    path='/manage/:id'
                    element={<PrivateRoute defaultElement={EventForm} />}
                    key={key}
                  />
                  <Route
                    path='/account'
                    element={<PrivateRoute defaultElement={AccountPage} />}
                  />
                  <Route
                    path='/profile/:id'
                    element={<PrivateRoute defaultElement={ProfilePage} />}
                  />
                  <Route path='/error' element={<ErrorComponent />} />
                </Routes>
              </Container>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
