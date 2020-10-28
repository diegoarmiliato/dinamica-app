import React, { useContext, useEffect } from "react";
import Cookies from 'universal-cookie';

import { Form, Input, Button, Card, CardBody, FormGroup, Col, InputGroup, InputGroupAddon, InputGroupText, FormFeedback } from "reactstrap";

import { Context } from "store";
import { loginActions } from "store/reducers/login";
import { api } from "assets/tools/api";
import { apiHeaders } from "assets/tools/api";
import { toastTypes, toastMessage } from "components/Sidebar/Toast";

function Login() {

  const { state, dispatch } = useContext(Context);

  const { login } = state;

  const cookies = new Cookies();

  useEffect(() => {  
    const autoComplete = cookies.get('autoComplete');    
    if (autoComplete) {
      dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: autoComplete === 'true' ? true : false });
    } else { 
      dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: false });
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (login.validUser && login.validPass) {
      if (login.username.length > 0 && login.password.length > 0) {
        dispatch({ type: 'LOADING_ON'});
        const username = login.username;
        const password = login.password;
        const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
        const config = {
          headers: {
            apiHeaders,
            'Authorization': `Basic ${token}`
          },
          withCredentials: true
        }
        api.post('/login', {} ,config)
          .then((res) => {
            if (res.data.status) {
              if (res.data.orgUnit === 'Funcionarios') {
                dispatch({ type: loginActions.LOGIN, payload: { username: res.data.username, 
                  firstName: res.data.firstName, 
                  lastName: res.data.lastName, 
                  orgUnit: res.data.orgUnit } });              
              } else {
                api.post('/logoff');
                dispatch({ type: loginActions.LOGOFF});
                toastMessage(toastTypes.error, 'Erro', 'Usuário não autorizado\nRealizado logoff');
              }
            } else {
              dispatch({ type: loginActions.LOGOFF});  
              toastMessage(toastTypes.error, 'Erro', res.data.message);
            }
          })
          .catch((err) => toastMessage(toastTypes.error, 'Erro', err.message))
          .finally(() => dispatch({ type: 'LOADING_OFF'}));
      }
    }
  }

  const handleChange = (evt) => {
    const { id, value, checked } = evt.target;  
    switch (id) {
      case 'username':
        dispatch({ type: loginActions.SET_LOGIN_USERNAME, payload: value});
        break;
      case 'password':
        dispatch({ type: loginActions.SET_LOGIN_PASSWORD, payload: value});
        break;
      case 'rememberMe':
        cookies.set('autoComplete', checked);
        dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: checked });
        break;
      default:
        break;
    }        
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Preencha suas credenciais</small>
            </div>
            <Form role="form" onSubmit={handleSubmit} autoComplete={login.autoComplete ? 'on' : 'new-off'}>
              <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                    <Input id="username" name="username" type="text" placeholder="nome de usuário" 
                           onChange={handleChange} autoComplete={login.autoComplete ? 'on' : 'new-username'}
                           invalid={!login.validUser} valid={!login.validUser}/>
                    <FormFeedback tooltip>O usuário é obrigatório</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                    <Input id="password" name="password" type="password" placeholder="senha" 
                           onChange={handleChange} autoComplete={login.autoComplete ? 'on' : 'new-password'}
                           invalid={!login.validPass} valid={!login.validPass}/>
                    <FormFeedback tooltip>A senha é obrigatória</FormFeedback>         
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id="rememberMe" type="checkbox" onChange={handleChange} checked={login.autoComplete}/>
                <label className="custom-control-label" htmlFor="rememberMe">
                  <span className="text-muted">Lembrar-me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit" disabled={!login.submitEnabled}>Login</Button>
              </div>
            </Form>
          </CardBody>
        </Card>        
      </Col>
    </>
  );
}

export default Login;
