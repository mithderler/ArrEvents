import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Grid, Loader } from 'semantic-ui-react';
import { clearEvents, fetchEvents } from '../eventActions';
import EventFilters from './EventFilters';

import EventList from './EventList';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventsFeed from './EventsFeed';

const EventDashboard = () => {
  const pageLimit = 2;
  const dispatch = useDispatch();
  const { events, moreEvents } = useSelector((state) => state.event);
  const { loading } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);
  const { feed } = useSelector((state) => state.profile);
  const [lastDocSnapshot, setLastDocSnapshot] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [predicate, setPredicate] = useState(
    new Map([
      ['startDate', new Date()],
      ['filter', 'all'],
    ])
  );

  function handleSetPredicate(key, value) {
    dispatch(clearEvents());
    setLastDocSnapshot(null);
    setPredicate(new Map(predicate.set(key, value)));
  }

  useEffect(() => {
    setLoadingInitial(true);
    dispatch(fetchEvents(predicate, pageLimit)).then((lastVisible) => {
      setLastDocSnapshot(lastVisible);
      setLoadingInitial(false);
    });
    return () => {
      dispatch(clearEvents());
    };
  }, [dispatch, predicate]);

  function handleFetchNextEvents() {
    dispatch(fetchEvents(predicate, pageLimit, lastDocSnapshot)).then(
      (lastVisible) => {
        setLastDocSnapshot(lastVisible);
      }
    );
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        )}
        <EventList
          events={events}
          getNextEvents={handleFetchNextEvents}
          loading={loading}
          moreEvents={moreEvents}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {authenticated && feed.length > 0 && <EventsFeed />}
        <EventFilters
          predicate={predicate}
          setPredicate={handleSetPredicate}
          loading={loading}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loading} />
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
