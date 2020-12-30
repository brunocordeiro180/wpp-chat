import React, { useState } from 'react';
import './Login.css';
import { Button, Form } from 'semantic-ui-react';
import Logo from '../../assets/images/vendergas-logo.png';
import api from '../../services/api';
import { login } from "../../services/auth";
import { withRouter } from 'react-router-dom';

const Login = ( { history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    async function handleSignIn(e){
        e.preventDefault();
        if (!email || !password) {
          setError("Preencha e-mail e senha para continuar!");
        } else {
          try {
            const response = await api.post("/login", { email, password });
            login(response.data.token, response.data.user.name ,response.data.user.company);
            history.push("/");
          } catch (err) {
            setError("Houve um problema com o login, verifique suas credenciais.")
          }
        }
    };

    return(
        <div id="login">
            <div id="login-logo">
                <a>
                    <img src={Logo}></img>
                </a>
            </div>
            <div className="form-container">
                <div style={{marginBottom : "20px"}} className="form-header">
                    <h2>Faça Login</h2>
                </div>
                {error && <p>{error}</p>}
                <Form onSubmit={handleSignIn}>
                    <Form.Field>
                        <input 
                            placeholder='Email' 
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <input 
                            placeholder='Senha' 
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Field>
                    <Button positive id="login-submit" type='submit'>Entrar</Button>
                </Form>
            </div>
        </div>
    )
}

export default withRouter(Login);