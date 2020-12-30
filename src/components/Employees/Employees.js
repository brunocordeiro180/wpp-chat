import React, { Fragment, useEffect, useState } from 'react';
import api from  '../../services/api';
import { getCompany } from  '../../services/auth';
import UsrImg from '../../assets/images/userImg.jpg';
import './Employees.css';

const Employees = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/usersByCompany', {params : {company : getCompany()}});
            setUsers(response.data.users);
          }
          loadUsers();
    }, [])

    return(
        <Fragment>  
            <h1>Funcionários - { getCompany()}</h1>
            <div className="ui relaxed list">
                {users.map(user => {
                    return(
                        <div className="item">
                            <img className="ui avatar image" src={UsrImg} />
                            <div className="content">
                                <a className="header">{user.name}</a>
                                <div className="description">{user.email}.</div>
                            </div>
                      </div>
                    );
                })}
            </div>
        </Fragment>
    );
}

export default Employees;