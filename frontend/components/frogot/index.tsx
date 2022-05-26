import KeyForm from './KeyForm';
import { useState } from 'react';
import ResetForm from './ResetForm';

export default function ForgotPasswordForm(): JSX.Element {
  const [question, setQuestion] = useState('');
  const [key, setKey] = useState('');
  return (
    <>
      {question === '' ? (
        <KeyForm setQuestion={setQuestion} setKey={setKey} />
      ) : (
        <ResetForm question={question} uniqueKey={key} />
      )}
    </>
  );
}
