import { useField } from 'formik';
import React from 'react';
import { FormField, Label } from 'semantic-ui-react';

export default function MyTextArea({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <FormField error={meta.touched && !!meta.error}>
      <label>{label}</label>
      <textarea {...field} {...props} />
      {meta.touched && meta.error ? (
        <Label basic color='red' style={{ border: 0 }}>
          * {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
}