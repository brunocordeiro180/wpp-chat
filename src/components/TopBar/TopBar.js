import React, { useState } from 'react';
import './TopBar.css';
import { AiOutlineUser } from 'react-icons/ai';
import { logout } from '../../services/auth';
import { useHistory } from 'react-router-dom';

const TopBar = ( ) => {

    const [showMenuOptions, setShowMenuOptions] = useState(false);
    const history = useHistory();

    function logoutAndRedirect(){
        logout();
        history.push("/");
    }

    return(
        <div id="top-navigation">
            <div id="action-container">
                <a id="link-employees" href="/employees">{ localStorage.getItem("@vendergas-company") }</a>
                <div id="profile-nav">
                    <AiOutlineUser id="profile-icon" onClick={() => setShowMenuOptions(!showMenuOptions) }/>
                    { showMenuOptions &&
                        <div className="dropdown-content">
                            <a href="#"><strong>{ localStorage.getItem("@vendergas-username") }</strong></a>
                            <a href="#">Status do Perfil</a>
                            <a href="#">Editar Perfil</a>
                            <div className="divider"/>
                            <a href="#">Link 2</a>
                            <a href="#">Link 3</a>
                            <div className="divider"/>
                            <a  style={{ cursor: "pointer"}} onClick={() => { logoutAndRedirect() }}>Sair</a>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TopBar;