import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastTypes = {
  success: 'SUCCESS',
  error: 'ERROR'
}

const toastMessage = (type, title, message) => {
  const config = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const splitMessage = message.split('\n').map((line, key) => {
    return <p key={key}>{line}</p>
  });
  
  const fullmessage = <><b>{title}</b><br/>{splitMessage}</>;

  switch (type) {
    case toastTypes.success:
      toast.success(fullmessage, config);
      break;
    case toastTypes.error:
      toast.error(fullmessage, config);
      break;
    default:
      break;
  }
}

function Toast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

export { toastMessage, toastTypes, Toast };