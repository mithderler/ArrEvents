const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.addFollowing = functions.firestore
  .document('following/{userUid}/userFollowing/{profileId}')
  .onCreate(async (snapshot, context) => {
    const following = snapshot.data();
    functions.logger.log({ following });
    try {
      const userDoc = await db
        .collection('users')
        .doc(context.params.userUid)
        .get();
      const batch = db.batch();
      batch.set(
        db
          .collection('following')
          .doc(context.params.profileId)
          .collection('userFollowers')
          .doc(context.params.userUid),
        {
          displayName: userDoc.data().displayName,
          photoURL: userDoc.data().photoURL,
          uid: userDoc.id,
        }
      );
      batch.update(db.collection('users').doc(context.params.profileId), {
        followerCount: admin.firestore.FieldValue.increment(1),
      });
      return await batch.commit();
    } catch (error) {
      return functions.logger.log(error);
    }
  });

exports.removeFollowing = functions.firestore
  .document('following/{userUid}/userFollowing/{profileId}')
  .onDelete(async (snapshot, context) => {
    const batch = db.batch();
    batch.delete(
      db
        .collection('following')
        .doc(context.params.profileId)
        .collection('userFollowers')
        .doc(context.params.userUid)
    );
    batch.update(db.collection('users').doc(context.params.profileId), {
      followerCount: admin.firestore.FieldValue.increment(-1),
    });
    try {
      return await batch.commit();
    } catch (error) {
      return functions.logger.log(error);
    }
  });

exports.eventUpdated = functions.firestore
  .document('events/{eventId}')
  .onUpdate(async (snapshot, context) => {
    const before = snapshot.before.data();
    const after = snapshot.after.data();
    if (before.attendees.length < after.attendees.length) {
      let attendeeJoined = after.attendees.filter(
        (item1) => !before.attendees.some((item2) => item2.id === item1.id)
      )[0];
      functions.logger.log({ attendeeJoined });
      try {
        const followerDocs = await db
          .collection('following')
          .doc(attendeeJoined.id)
          .collection('userFollowers')
          .get();
        followerDocs.forEach((follower) => {
          admin
            .database()
            .ref(`/posts/${follower.id}`)
            .push(
              newPost(
                attendeeJoined,
                'joined-event',
                context.params.eventId,
                before
              )
            );
        });
      } catch (error) {
        return functions.logger.log(error);
      }
    }
    if (before.attendees.length > after.attendees.length) {
      let attendeeLeft = before.attendees.filter(
        (item1) => !after.attendees.some((item2) => item2.id === item1.id)
      )[0];
      functions.logger.log({ attendeeLeft });
      try {
        const followerDocs = await db
          .collection('following')
          .doc(attendeeLeft.id)
          .collection('userFollowers')
          .get();
        followerDocs.forEach((follower) => {
          admin
            .database()
            .ref(`/posts/${follower.id}`)
            .push(
              newPost(
                attendeeLeft,
                'left-event',
                context.params.eventId,
                before
              )
            );
        });
      } catch (error) {
        return functions.logger.log(error);
      }
    }
    return functions.logger.log('finished eventUpdated');
  });

//Update this function and add delete function too
exports.eventCreated = functions.firestore
  .document('/events/{eventId}')
  .onCreate(async (snapshot, context) => {
    try {
      const event = snapshot.data();
      functions.logger.log('event: ', event);
      const user = await db.collection('users').doc(event.hostUid).get();
      functions.logger.log('user: ', user.data());
      const followerDocs = await db
        .collection('following')
        .doc(event.hostUid)
        .collection('userFollowers')
        .get();
      functions.logger.log('followerDocs: ', followerDocs);
      followerDocs.forEach((follower) => {
        functions.logger.log('follower: ', follower);
        admin
          .database()
          .ref(`/posts/${follower.id}`)
          .push(
            newPost(user.data(), 'create-event', context.params.eventId, event)
          );
      });
    } catch (error) {
      return functions.logger.log(error);
    }
    return functions.logger.log('finished eventCreated');
  });

function newPost(user, code, eventId, event) {
  return {
    photoURL: user.photoURL,
    date: admin.database.ServerValue.TIMESTAMP,
    code,
    displayName: user.displayName,
    eventId,
    userUid: user.id,
    title: event.title,
  };
}
