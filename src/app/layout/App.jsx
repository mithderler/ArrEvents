import { Routes, Route, useLocation } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import NavBar from '../../features/nav/NavBar';
import HomePage from '../../features/home/HomePage';
import EventDashboard from '../../features/events/eventDashboard/EventDashboard';
import EventForm from '../../features/events/eventForm/EventForm';
import EventDetailedPage from '../../features/events/eventDetailed/EventDetailedPage';
import './style.css';
import Sandbox from '../../features/sandbox/Sandbox';
import ModalManager from '../common/modals/ModalManager';

function App() {
  const { key } = useLocation();

  return (
    <>
      <ModalManager />
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
                  <Route path='/sandbox' element={<Sandbox />} />
                  <Route path='/events/:id' element={<EventDetailedPage />} />
                  <Route
                    path='/createEvent'
                    element={<EventForm />}
                    key={key}
                  />
                  <Route path='/manage/:id' element={<EventForm />} key={key} />
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
