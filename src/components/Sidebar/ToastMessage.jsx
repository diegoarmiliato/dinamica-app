import React, { useState } from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

const ToastMessage = (props) => {
  const { buttonLabel, message, title } = props;
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);

  return (
    <>
      <Toast isOpen={true}>
        <ToastHeader toggle={toggle}>{title}</ToastHeader>
        <ToastBody>{message}</ToastBody>
      </Toast>
    </>
  );
}

export default ToastMessage;