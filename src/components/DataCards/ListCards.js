import React, { useEffect, useState } from 'react'
import { getCompany, getToken } from '../../services/auth';
import SocketContext from '../../context/socketContext';
import DataCard from './DataCard';
import api from "../../services/api";
import './ListCards.css';  
import { FaUserTie, FaUsers, FaUserAlt } from 'react-icons/fa';
import { TiCancel } from 'react-icons/ti';

const ListCards = ({ clientsLength,contactsLength, hostDevice, socket }) => {
    const [messages, setMessages] = useState([]);
    const [blockedContacts, setBlockedContacts] = useState(0);
    const [qtdUsersByCompany, setQtdUsersByCompany] = useState(0);

    useEffect(async () => {
        if(hostDevice.wid){
            await api.get('/messagesToday', {
                        params : {hostNumber : hostDevice.wid},
                        headers: {
                            'Authorization': `Bearer ${getToken()}`
                        }
                }).then(response => {
                setMessages(response.data.messages);
            })

            await api.get('/totalUsersByCompany', {
                params : {company : getCompany()},
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
                    }).then(response => {
                    setQtdUsersByCompany(response.data.total);
                })
        }
    }, [hostDevice])

    useEffect(() => {
        socket.emit("askBlockedContacts", {
            room: getCompany()
        });

        socket.on("apiSendBlockedContacts", data => {
            setBlockedContacts(data.blockedContacts.length);
        });
    }, [hostDevice])

    return(
        <div id="cards-content" style={{overflow: "auto"}}>
            <div id="row">
                <DataCard title="Atendentes" icon={FaUserTie} qtd={qtdUsersByCompany} />
                <DataCard title="Conversas" icon={FaUserAlt} qtd={clientsLength} />
                <DataCard title="Contatos" icon={FaUsers} qtd={contactsLength} />
                <DataCard title="Bloqueados" icon={TiCancel} qtd={blockedContacts} />
            </div>
        </div>
    );

}

const ListCardsWithSocket = props => {
	return (
		<SocketContext.Consumer>
			{socket => <ListCards {...props} socket={socket} />}
		</SocketContext.Consumer>
	)
}

export default ListCardsWithSocket;