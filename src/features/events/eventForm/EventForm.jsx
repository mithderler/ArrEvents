/* global google */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Header, Segment } from 'semantic-ui-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import MyTextInput from '../../../app/common/form/MyTextInput';
import { updateEvent, createEvent } from '../eventActions';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryData } from '../../../app/api/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import MyPlaceInput from '../../../app/common/form/MyPlaceInput';

const EventForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const selectedEvent = useSelector((state) =>
    state.event.events.find((evt) => evt.id === params.id)
  );

  const initialValues = selectedEvent ?? {
    title: '',
    category: '',
    description: '',
    city: {
      address: '',
      latLng: null,
    },
    venue: {
      address: '',
      latLng: null,
    },
    date: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('You must provide a title!'),
    category: Yup.string().required('You must provide a category!'),
    description: Yup.string().required(),
    city: Yup.object().shape({
      address: Yup.string().required('City is required'),
    }),
    venue: Yup.object().shape({
      address: Yup.string().required('Venue is required'),
    }),
    date: Yup.string().required(),
  });

  return (
    <Segment clearing>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          selectedEvent
            ? dispatch(updateEvent({ ...selectedEvent, ...values }))
            : dispatch(
                createEvent({
                  ...values,
                  id: uuidv4(),
                  hostedBy: 'Mith',
                  attendees: [],
                  hostPhotoURL: '/assets/user.png',
                })
              );
          navigate('/events');
        }}
      >
        {({ isSubmitting, dirty, isValid, values }) => (
          <Form className='ui form'>
            <Header sub color='teal' content='Event Details' />
            <MyTextInput name='title' placeholder='Event title' />
            <MySelectInput
              name='category'
              placeholder='Category'
              options={categoryData}
            />
            <MyTextArea name='description' placeholder='Description' rows={3} />
            <Header sub color='teal' content='Event Location Details' />
            <MyPlaceInput name='city' placeholder='City' />
            <MyPlaceInput
              name='venue'
              disabled={!values.city.latLng}
              placeholder='Venue'
              options={{
                location: new google.maps.LatLng(values.city.latLng),
                radius: 1000,
                types: ['establishment'],
              }}
            />
            <MyDateInput
              name='date'
              placeholderText='Date'
              timeFormat='HH:mm'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm a'
              autoComplete='off'
            />

            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type='submit'
              content={selectedEvent ? 'Update' : 'Submit'}
              positive
              floated='right'
            />
            <Button
              disabled={isSubmitting}
              as={Link}
              to='/events'
              type='submit'
              content='Cancel'
              floated='right'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default EventForm;
