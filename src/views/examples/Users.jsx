/* eslint-disable array-callback-return */
import React, { useContext, useEffect } from "react";
import { userCreateActions } from 'store/reducers/userCreate';
import { userListActions } from 'store/reducers/userList';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col,
  CardBody,
  FormGroup,
  Collapse,
  Button,
  Input,
  Form,
  FormFeedback
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";
import { Context } from "./../../store";
import { api } from "assets/tools/api";
import { toastTypes, toastMessage } from "components/Sidebar/Toast";

function Users(props) {

  const { state, dispatch } = useContext(Context);

  const { userCreate, userList } = state;

  const formFeedbackStyle = {
    position: 'inherit'
  }

  const queryUsers = () => {
    dispatch({ type: 'LOADING_ON'})
    api.get('/users')
    .then((res) => {   
      if (res.data.status) {    
        dispatch({ type: userListActions.SET_USERLIST_FULL, payload: res.data.userList
                                                            .filter((user) => user.orgUnit === 'Alunos')
                                                            .sort((a,b) =>  a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0)
                                                            .map((user) => { return { ...user, active: user.active ? 'ativo' : 'bloqueado' } })});
      } else {
        toastMessage(toastTypes.error, 'Erro', res.data.message);
      }
    })
    .finally(() => dispatch({ type: 'LOADING_OFF'}));    
  }

  useEffect(() => {
    queryUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (userCreate.validUser && userCreate.validPass && userCreate.validFirst && userCreate.validLast) {
      if (userCreate.username.length > 0 && userCreate.password.length > 0 && userCreate.firstName.length > 0 && userCreate.lastName.length > 0) {
        dispatch({ type: 'LOADING_ON'});
        const body = {
          username: userCreate.username,
          password: userCreate.password,
          firstName: userCreate.firstName.trim(),
          lastName: userCreate.lastName.trim(),
          orgUnit: "Alunos",
          mailDomain: "dinamica.net"
        }
        api.post('/users', body)
        .then((res) => {      
          if (res.data.status) {
            toastMessage(toastTypes.success, 'Sucesso', `Criado usuário ${body.username} para o aluno ${body.firstName} ${body.lastName}`);
            dispatch({ type: userCreateActions.SET_USER_CREATED });
            queryUsers();
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
    switch(evt.target.id) {
      case 'input-firstName':                        
        dispatch({ type: userCreateActions.SET_CREATEUSE_FIRSTNAME, payload: multipleCapitalizer(value)});
        break;
      case 'input-lastName':        
        dispatch({ type: userCreateActions.SET_CREATEUSE_LASTNAME, payload: multipleCapitalizer(value)});        
        break;
      case 'input-username':
        // allow only numbers in username field
        dispatch({ type: userCreateActions.SET_CREATEUSE_USERNAME, payload: value.replaceAll(/[^0-9]/g,'')});
        break;
      case 'input-password': // allow no spaces in password field
        dispatch({ type: userCreateActions.SET_CREATEUSE_PASSWORD, payload: value.replaceAll(/\s/g,'')});
        break;
      case 'input-search':
        dispatch({ type: userListActions.SET_USERLIST_FILTER, payload: value});
        break;
      default:
        break;
    }
  }

  const simpleCapitalizer = (text) => {  
    let result = text.replaceAll(/[^A-Za-z\s]/g,'').trim(); 
    const size = result.length;
    if (size > 0) {      
      const firstLetter = result.charAt(0).toUpperCase();
      if (size === 1) {
        result = firstLetter;        
      } else {
        const rest = text.slice(1, size).toLowerCase();
        result = `${firstLetter}${rest}`
      }
    } else {
      result = '';
    }
    return result;    
  }

  const multipleCapitalizer = (text) => {
    let result = text;
    // Checks if the string is all a bunch of spaces
    if (result.trim().length === 0) {
      result = '';
    } else {
      if (result.indexOf(' ') < 0) {
        // if the string has no spaces, return a single simple capitalizer instance
        result = simpleCapitalizer(result); 
      } else {
        // If the String has spaces, then start the Multiple Capitalizing routine
        // Removes all double spaces, converting into a single one
        while (result.indexOf('  ') > 0) {
          result = result.replaceAll(/\s\s/g, ' ');
        }
        // Splits the string into an Array
        const stringArray = result.split(' ');
        // Capitalizes all words, skipping bank words
        const newStringArray = stringArray.map((string) => {
          const capitalized = simpleCapitalizer(string);
          if (capitalized.length > 0) { return capitalized; }        
        });
        // Filters the generated string, skipping the undefined values
        const filteredStringArray = newStringArray.filter((string) => {
          if (string) { return string; }
        });
        // Merges back the fully treated and capitalized string
        const newString = filteredStringArray.join(' ');
        // If the last character which was inputted was a space, keep it
        // if not, then put the space back
        if (result.substr(result.length - 1, 1).match(/\s/)) {
          result = `${newString} `;
        } else {
          result = newString;
        }      
      }
    }
    return result;
  }

  const handleUserLock = (username, status) => {
    dispatch({ type: 'LOADING_ON'});
    const body = {
      username: userCreate.username,
      active: status === 'ativo' ? false : true
    }
    api.put('/users', body)
    .then((res) => {      
      if (res.data.status) {
        const msg = status === 'ativo' ? 'bloqueado' : 'desbloqueado';
        toastMessage(toastTypes.success, 'Sucesso', `Usuário ${body.username} ${msg}`);
      } else {
        toastMessage(toastTypes.error, 'Erro', res.data.message);
      }
    })
    .catch((err) => {
      toastMessage(toastTypes.error, 'Erro', err.message);
    })
    .finally(() => dispatch({ type: 'LOADING_OFF'}));
  }

  const widthColumns = {
    username: { width: '15%' },
    firstName: { width: '20%' },
    lastname: { width: '40%' },
    active: { width: '15%' },
    options: { width: '10%' }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">              
          <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0" onClick={() => dispatch({type: userCreateActions.COLLAPSE_CREATEUSERCARD})}>
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Criar Novo Usuário</h3>
                    {userCreate.updateFormField ? <></> : <></>}
                  </Col>
                </Row>
              </CardHeader>
              <Collapse id="collapseCreateUser" isOpen={userCreate.createCard}>
                <CardBody>
                  <Form autoComplete="new-off" onSubmit={handleSubmit}>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-firstName">Nome</label>                            
                            <Input id="input-firstName" name="crtform-firstName" type="text" placeholder="primeiro nome" 
                                   value={userCreate.firstName} onChange={handleInputChange} autoComplete="new-firstName"
                                   invalid={!userCreate.validFirst} valid={!userCreate.validFirst}/>
                            <FormFeedback style={formFeedbackStyle} tooltip>O nome é obrigatório</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-lastName">Sobrenome</label>
                            <Input id="input-lastName" name="crtform-lastName" type="text" placeholder="sobrenome completo" 
                                   value={userCreate.lastName} onChange={handleInputChange} autoComplete="new-lastName"
                                   invalid={!userCreate.validLast} valid={!userCreate.validLast}/>
                            <FormFeedback style={formFeedbackStyle} tooltip>O sobrenome é obrigatório</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Usuário</label>
                            <Input id="input-username" name="crtform-username" type="text" placeholder="nome de usuário" 
                                   value={userCreate.username} onChange={handleInputChange} autoComplete="new-username"
                                   invalid={!userCreate.validUser} valid={!userCreate.validUser}/>
                                    <FormFeedback style={formFeedbackStyle} tooltip>O nome do usuário é obrigatório e deve conter apenas números</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label className="form-control-label" htmlFor="input-password">Senha</label>
                            <Input id="input-password" name="crtform-password" type="password" placeholder="senha" 
                                   value={userCreate.password} onChange={handleInputChange} autoComplete="new-password"
                                   invalid={!userCreate.validPass} valid={!userCreate.validPass}/>
                            <FormFeedback style={formFeedbackStyle} tooltip>A senha é obrigatória</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div> 
                    <div className="text-center">
                      <Button id="btnCreateUser" className="my-4" color="primary" type="submit" disabled={!userCreate.submitEnabled}>Criar Usuário</Button>
                    </div>                 
                  </Form>
                </CardBody>
              </Collapse>
            </Card>               
          </div>
        </Row>
        {/* User table */}
        <Row className="mt-5">
          <div className="col">
          <Card className="shadow">
              <CardHeader className="border-0">
              <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Lista de Usuários</h3>
                  </Col>
                  {/* <Col> */}
                    <div className="form-inline">
                      <div className="input-group-alternative input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search" />                          
                        </span>                      
                        <Input id="input-search" placeholder="Search" type="text" value={userList.filter} onChange={handleInputChange}/>
                      </div>                  
                    </div>
                  {/* </Col> */}
                </Row>             
              </CardHeader>
              <Table className="align-items-center table-flush" size="sm" hover responsive>
                <thead className="thead-light">
                  <tr>
                    <th className="noUi-target" scope="col" style={widthColumns.username}>Usuário</th>
                    <th className="noUi-target" scope="col" style={widthColumns.firstName}>Nome<i className="fas fa-sort-down"/></th>
                    <th className="noUi-target" scope="col" style={widthColumns.lastname}>Sobrenome</th>
                    <th className="noUi-target" scope="col" style={widthColumns.active}>Status</th>
                    <th className="noUi-target" scope="col" style={widthColumns.options}/>
                  </tr>
                </thead>
                <tbody>
                  {userList.users
                    .slice(((userList.currentPage-1)*userList.numberEntries), ((userList.currentPage-1)*userList.numberEntries)+userList.numberEntries)
                    .map((user, key) => {
                      return(
                        <tr key={key}>
                          <th scope="row"><span className="mb-0 text-sm">{user.username}</span></th>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>
                            <Badge color="" className="badge-dot"><i className={user.active === 'ativo' ? 'bg-success' : 'bg-danger'}/>
                              {user.active}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={e => e.preventDefault()}>
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem href="#pablo" onClick={() => handleUserLock(user.username, user.active)}>{user.active === 'ativo' ? 'Bloquear' : 'Ativar'}</DropdownItem>
                                <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>Alterar Senha</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>                      
                      )})}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                    <PaginationItem className={userList.currentPage === 1 ? 'disabled' : 'enabled'}>
                      <PaginationLink href="#pablo" onClick={() => dispatch({ type: userListActions.SET_USERLIST_PAGE, payload: userList.currentPage-1})} tabIndex="-1">
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>                    
                    {[...Array(userList.pageCount)].map((it, key) => {
                      let valid = () => {
                        if (userList.currentPage <= 2 && key < 5) {
                          return true;                        
                        } else if  (userList.currentPage >= userList.pageCount - 1 && key > userList.pageCount - 6) {
                          return true
                        } else if (userList.currentPage < userList.pageCount - 1 && userList.currentPage > 2 && 
                                   key >= userList.currentPage - 3 && key <= userList.currentPage + 1) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                      if (valid()) {
                        const idx = key + 1;                                 
                        return (
                          <PaginationItem key={idx} className={idx === userList.currentPage ? 'active' : undefined}>
                            <PaginationLink onClick={() => dispatch({ type: userListActions.SET_USERLIST_PAGE, payload: idx})}>{idx}</PaginationLink>
                          </PaginationItem>
                        );
                      }
                    })}                    
                    <PaginationItem className={userList.currentPage === userList.pageCount ? 'disabled' : 'enabled'}>
                      <PaginationLink href="#pablo" onClick={() => dispatch({ type: userListActions.SET_USERLIST_PAGE, payload: userList.currentPage+1})}>
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

export default Users;
