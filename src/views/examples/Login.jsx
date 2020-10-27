import React, { useContext, useEffect } from "react";
import Cookies from 'universal-cookie';

import { Button, Card, CardBody, FormGroup, Col } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';

import { Context } from "store";
import { loginActions } from "store/reducers/login";
import { api } from "assets/tools/api";
import { apiHeaders } from "assets/tools/api";
import { toastTypes, toastMessage } from "components/Sidebar/Toast";

function Login() {

  const { state, dispatch } = useContext(Context);

  const cookies = new Cookies();

  useEffect(() => {  
    const autoComplete = cookies.get('autoComplete');    
    if (autoComplete) {
      console.log(autoComplete);
      dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: autoComplete === 'true' ? true : false });
    } else { 
      dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: false });
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  
  const handleValidSubmit = () => {
    dispatch({ type: 'LOADING_ON'});
    const username = state.login.username;
    const password = state.login.password;
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
      .catch((err) => {
        toastMessage(toastTypes.error, 'Erro', err.message);
      })
      .finally(() => dispatch({ type: 'LOADING_OFF'}));
  }

  const handleChange = (evt, value) => {    
    switch (evt.target.id) {
      case 'username':
        dispatch({ type: loginActions.SET_LOGIN_USERNAME, payload: value});
        break;
      case 'password':
        dispatch({ type: loginActions.SET_LOGIN_PASSWORD, payload: value});
        break;
      case 'rememberMe':
        cookies.set('autoComplete', evt.target.checked);
        dispatch({ type: loginActions.SET_LOGIN_AUTOCOMPLETE, payload: evt.target.checked });
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
            <AvForm role="form" onValidSubmit={handleValidSubmit} autoComplete={state.login.autoComplete ? 'on' : 'new-off'}>
              <FormGroup className="mb-3">
                  <AvField id="username" name="username" type="text" placeholder="nome de usuário" 
                           validate={{ required: { value: true, errorMessage: "O campo usuário é obrigatório"}}}
                           onChange={handleChange} autoComplete={state.login.autoComplete ? 'on' : 'new-username'}/>
              </FormGroup>
              <FormGroup>
                  <AvField id="password" name="password" type="password" placeholder="senha" 
                           validate={{ required: { value: true, errorMessage: "O campo senha é obrigatório"}}}
                           onChange={handleChange} autoComplete={state.login.autoComplete ? 'on' : 'new-password'}/>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input className="custom-control-input" id="rememberMe" type="checkbox" onChange={handleChange} checked={state.login.autoComplete}/>
                <label className="custom-control-label" htmlFor="rememberMe">
                  <span className="text-muted">Lembrar-me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">Login</Button>
              </div>
            </AvForm>
          </CardBody>
        </Card>        
      </Col>
    </>
  );
}

export default Login;
