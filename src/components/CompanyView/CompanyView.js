/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { SocketContext } from '../../context/socketContext';
import LeftPanel from '../LeftPanel/LeftPanel';
import Chat from '../Chat/Chat';
import ContactsNav from '../ContactsNav/ContactsNav';
import TopBar from '../TopBar/TopBar';
import './styles.css';
import olhaOGas from '../../assets/sound-files/notification.wav';
import { addChat } from '../../services/chats';
import { getUsername, getCompany } from '../../services/auth';
import { setStorageMessage } from '../../services/messages';
import SenderInput from '../SenderInput';
import Employees from '../Employees/Employees';
import HomeContent from '../HomeContent/HomeContent';

const CompanyView = ({collapse, socket}) => {
  const [hostDevice, setHostDevice] = useState({});
  const [displayChat, setDisplayChat] = useState({});
  const [contacts, setContacts] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState(() => {
    const get = localStorage.getItem("@vendergas-messages");
    
    if(get){
      const getMessages = JSON.parse(get);
      return getMessages;
    }else{
      return [];
    }
  });
  const [clients, setClients] = useState(() => {
    const get = localStorage.getItem("@vendergas-chats");
      if(get) {
        const getNumbers = JSON.parse(get);
        return getNumbers
      } else {
        return []
      }
  });

  useEffect(() => {
    socket.on('apiSendFirst', data => {
      const allUnreadMessages = data.unreadMessages; 
      setHostDevice(data.hostDevice);
      setContacts(data.clients);
      if(allUnreadMessages.length > 0){
        const aux = [];
        for(let msg of allUnreadMessages){

          const messagesIds = messages.find(function(el){
            return (el.from === msg.from) && (el.body === msg.msgContent) && (el.t === msg.timestamp);
          })

          if(!messagesIds){
            setMessages(msgs => [...msgs, {msgContent: msg.body, from : msg.from, to: msg.to, timestamp : msg.t}]);
          }

          if(!aux.includes(msg.from)){
            aux.push(msg.from);
            setUnreadMessages(unreads => [...unreads, msg.id._serialized]);
            setClients(clients => [...new Set([...clients, msg.id._serialized])]);
          }      
        }
      }
    })
  }, [])

  useEffect(() => {
    socket.on('errorToFront', async () => {
      toast.error('Erro ao se conectar! Verifique a conexão com o seu whatsapp')
    })
  }, [])
  
  useEffect(() => {
    socket.on('successToFront', async () => {
      toast.warning('Conectado! Atualize a página para voltar a usar')
    })
  }, [])

  useEffect(() => {
    socket.on('apiSend', async data => {
      const notifyAudio = new Audio(olhaOGas);
      notifyAudio.play();
      if(!displayChat[data.from] && !unreadMessages.includes(data.from))
        setUnreadMessages(unreads => [...unreads, data.from])
      setStorageMessage(data);
      setMessages(msgs => [...msgs, data]);
      setClients(clients => [...new Set([...clients, data.from])]);
      addChat(data.from);
    })
  }, [])

  var className = 'main';
  className = collapse ? className += ' collapse' : className;

  return (
    <div className={className}>
      <ContactsNav visible={visible} setVisible={setVisible} contacts={contacts} setClients={setClients} displayChat={displayChat} setDisplayChat={setDisplayChat}/>
      <LeftPanel 
        clients={clients} 
        setClients={setClients}
        displayChat={displayChat} 
        setDisplayChat={setDisplayChat} 
        messages={messages} 
        visible={visible}
        setNavVisible={setVisible}
        contacts={contacts}
        unreadMessages={unreadMessages}
        setUnreadMessages={setUnreadMessages}
      />
        <div style={{ display: "flex", flexDirection : "column", width: "100%", height: "100%", backgroundColor: "#E0E0E0", position: "relative"}}>
          <TopBar />
          <div style={{ display: "flex", height: "100%"}}>
            <div id="main-content">
              {window.location.pathname == "/employees" ?
                <Employees /> :
                hostDevice != {} ? 
                <HomeContent contactsLength={contacts.length} hostDevice={ hostDevice }/> : null
              }
            </div>
            {hostDevice.wid && clients.map(client => {
              const hash = shortid.generate()
              return (
                <div className="containerMother" style={{width : "-webkit-fill-available", position: "relative", display : (displayChat[client] ? "block" : "none")}}>
                  <Chat
                    key={hash} 
                    messages={messages.filter(message => (
                      message.from === client || (message.from === hostDevice.wid._serialized && message.to === client)
                    ))} 
                    setMessages={setMessages}
                    client={client}
                    setClients={setClients}
                    displayChat={displayChat}
                    hostDevice={hostDevice}
                    setDisplayChat={setDisplayChat}
                    contacts={contacts}
                    unreadMessages={unreadMessages}
                    setUnreadMessages={setUnreadMessages}
                  />
      
                  <SenderInput
                    hostDevice={hostDevice} 
                    client={client}
                    setMessages={setMessages}
                    setStorageMessage={setStorageMessage}
                    addChat={addChat}
                  />
                </div>
              )
            })}
          </div>
        </div>
    </div>
  )
}

const MainWithSocket = props => {
  return (
    <SocketContext.Consumer>
      {socket => <CompanyView {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
}

export default MainWithSocket;