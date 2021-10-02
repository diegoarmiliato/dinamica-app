import React, { useContext, useEffect} from 'react';
import { Context } from 'store';
import { loginActions } from 'store/reducers/login';
import { getAccessToken, isTokenExpired } from 'variables/accessToken';
import { api, apiHeaders } from "assets/tools/api";
import { toastMessage, toastTypes } from 'components/Sidebar/Toast';
import { loadingActions } from 'store/reducers/loading';
import Cookies from 'universal-cookie';
import { setAccessToken } from 'variables/accessToken';


function Authentication(props) {

  const { state, dispatch } = useContext(Context);

  const { login } = state;

  const cookies = new Cookies();

  const authenticate = () => {
    console.log(`token ${getAccessToken()}`);
    console.log(`expirado ${isTokenExpired()}`);
    if (!isTokenExpired()) {
      const Authorization = `Bearer ${getAccessToken()}`;
      const config = {
        headers: {
          apiHeaders,
          Authorization
        },
        withCredentials: true
      }
      api.post('/isAuth', {} ,config)
      .then((res) => {
        if (res.status !== 202) {
          toastMessage(toastTypes.error, 'Erro', 'Não autenticado');
          dispatch({ type: loginActions.LOGOFF });
        }
      })
      .catch((err) => {
        toastMessage(toastTypes.error, 'Erro', err.message);
        dispatch({ type: loginActions.LOGOFF });
      });
    } else {      
      const config = {
        headers: {
          apiHeaders
        },
        withCredentials: true
      }
      api.post('/refresh', {}, config)
      .then(res => {
        if (res.status === 202) {
          const { token } = res.data;
          if (token) {
            setAccessToken(token);
            dispatch({ type: loginActions.LOGIN });            
          } else {
            toastMessage(toastTypes.error, 'Erro', 'Não autenticado');
            dispatch({ type: loginActions.LOGOFF });            
          }
        } else {
          toastMessage(toastTypes.error, 'Erro', 'Não autenticado');
          dispatch({ type: loginActions.LOGOFF });
        }
      })
      .catch(err => {
        toastMessage(toastTypes.error, 'Erro', err.message);
        dispatch({ type: loginActions.LOGOFF });
      });
      dispatch({ type: loadingActions.LOADING_OFF });
    }
  }

  useEffect(() => {
    authenticate();
  }, [login.loggedOn]);

  return (
    <div>
      {props.children}
    </div>
  )
}

export default Authentication;
