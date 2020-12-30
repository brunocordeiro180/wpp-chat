/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SocketContext from '../../context/socketContext';
import './LeftPanel.css';
import { RiAddFill } from 'react-icons/ri';
import { maskPhone } from '../Chat/maskPhone';
import { BiX } from 'react-icons/bi';
import { removeChat } from '../../services/chats';
import { removeMessages } from '../../services/messages';
import { getCompany } from '../../services/auth';

const LeftPanel = ({ clients, setClients , displayChat, setDisplayChat, visible, setNavVisible, contacts, unreadMessages, setUnreadMessages, socket}) => {

  function getNameFromClient(client){
		const contact = contacts.find(function(el){
			return el.id === client;
		})
		return (contact ? contact.name : "");
  }

  function removeClientFromState(client){
    setDisplayChat({...displayChat, [client] : false});
    setClients(x => x.filter(item => item !== client));
    removeChat(client);
    removeMessages(client);
  }

  function setChatAsReaded(client){
    const room = getCompany();
    socket.emit("markAsReadFront", {
      room,
      data: client
    });
  }

  function removeClientIfRead(client){
    if(unreadMessages.includes(client)){
      setUnreadMessages(unreadMessages.filter(item => item != client))
    }
  }

  return (
    <aside id="left-panel" className="ember-view">
      <nav id="visitors" style={{paddingTop: "15px"}}>
        <div className="ui link list">
          <div id="conversas-ativas-header">
            <span>Conversas ativas</span>
            <button id="add-chat-button" onClick={ () => setNavVisible(!visible) }>
              <RiAddFill id="add-chat-icon"/>
            </button>
          </div>
          {clients.map(chat => {
            return(
              <div key={chat} id="contact-div" style={{display: "flex", position: "relative", alignItems: "center"}}>
                <div className="item" style={{zIndex : "5", backgroundColor: unreadMessages.includes(chat) && !displayChat[chat] ? "#44ac4a" : "#242424"}}>
                  <a 
                    onClick={() => {
                      setDisplayChat({...displayChat, [chat] : true});
                      removeClientIfRead(chat);
                    }} 
                  >
                    <div className="client-name" style={{ display : "flex", flexDirection: "column", fontWeight: unreadMessages.includes(chat) && !displayChat[chat] ? "bold" : "normal"}}> 
                      <span style={{marginBottom: "3px"}} >{ getNameFromClient(chat)}</span>
                      <span style={{fontSize : "0.8em"}}>{ maskPhone(chat) }</span>
                    </div>
                  </a>
                </div>
                <div onClick={() => {
                  removeClientFromState(chat);
                  setChatAsReaded(chat);
                }} className="close-contact-div">
                  <a style={{color: "white"}}><BiX  size={20}/></a>
                </div>
              </div>
              )
          })}
        </div>
      </nav>  
    </aside>
  ) 
}

const LeftPanelWithSocket = (props) => {
  return (
    <SocketContext.Consumer>
      {socket => <LeftPanel {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
}

export default LeftPanelWithSocket; 