import { api } from 'assets/tools/api';
import React, { useContext } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Context } from 'store';
import { userChangeActions } from 'store/reducers/userChange';
import { toastTypes } from './Toast';
import { toastMessage } from './Toast';

function ChangePass(props) {

  const { state, dispatch } = useContext(Context);

  const { userChange } = state;

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (userChange.validNewPassword) {    
      if (userChange.newPassword.length > 0 && userChange.username.length > 0) {
        dispatch({ type: 'LOADING_ON'});
        const body = {
          username: userChange.username,
          newPassword: userChange.newPassword
        }
        api.patch('/password', body)
        .then((res) => {      
          if (res.data.status) {
            toastMessage(toastTypes.success, 'Sucesso', `Senha do usuário ${body.username} alterada`);
            toggle();
          } else {
            toastMessage(toastTypes.error, 'Erro', res.data.message);
          }
        })
        .catch((err) => {
          toastMessage(toastTypes.error, 'Erro', err.message);
        })
        .finally(() => dispatch({ type: 'LOADING_OFF'}));
      }
    }
  }

  const handleInputChange = (evt) => {
    const value = evt.target.value
    dispatch({ type: userChangeActions.SET_USERLIST_NEWPASSWORD, payload: value.replaceAll(/\s/g,'')});
  }

  const toggle = () => {
    dispatch({ type: userChangeActions.SET_USERLIST_PASSWORDPOPUP});
  }

  const styleNone = {
    display: 'none'
  }

  return (
    <div>      
      <Modal isOpen={userChange.changePassModal} toggle={() => toggle()}>
        <ModalHeader toggle={() => toggle()}>Alterar Senha</ModalHeader>
        <Form autoComplete="new-off" onSubmit={handleSubmit}>  
          <ModalBody>          
            <FormGroup>
              <Input name="Fake_Password" id="Fake_Password" type="password" placeholder="password" autoComplete="password" style={styleNone}/>
              <Input id="input-password" name="change-password" type="password" placeholder="senha"
                     value={userChange.newPassword} onChange={handleInputChange}/>
              <FormFeedback tooltip>A senha é obrigatória</FormFeedback>
            </FormGroup>          
          </ModalBody>
          <ModalFooter>
            <Button id="btnChangeUser" className="my-4" color="primary" type="submit" disabled={!userChange.submitEnabled}>Alterar</Button>
            <Button color="secondary" onClick={() => toggle()}>Cancelar</Button>
          </ModalFooter>
        </Form>
      </Modal>      
    </div>
  );
}

export { ChangePass };