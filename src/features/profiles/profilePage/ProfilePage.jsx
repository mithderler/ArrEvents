import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import useFirestoreHook from '../../../app/hooks/useFirestoreDoc';
import { getUserProfile } from '../../../app/firestore/firestoreService';
import { useParams } from 'react-router-dom';
import { listenToSelectedUserProfile } from '../profileActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

function ProfilePage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { selectedUserProfile } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.async);

  useFirestoreHook({
    query: () => getUserProfile(params.id),
    data: (profile) => dispatch(listenToSelectedUserProfile(profile)),
    deps: [dispatch, params.id],
  });

  if ((loading && !selectedUserProfile) || (!selectedUserProfile && !error))
    return <LoadingComponent content='Loading profile...' />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader
          profile={selectedUserProfile}
          isCurrentUser={currentUser?.uid === selectedUserProfile?.id}
        />
        <ProfileContent
          profile={selectedUserProfile}
          isCurrentUser={currentUser?.uid === selectedUserProfile?.id}
        />
      </Grid.Column>
    </Grid>
  );
}

export default ProfilePage;
