/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { SocketContext } from '../../context/socketContext';
import LeftPanel from '../LeftPanel/LeftPanel';
import Chat from '../Chat/Chat';
import ContactsNav from '../ContactsNav/ContactsNav';
import TopBar from '../TopBar/TopBar';
import '../../App.css';
import './Main.css';
import olhaOGas from '../../assets/sound-files/notification.wav';
import { addChat } from '../../services/chats';
import { getUsername, getCompany } from '../../services/auth';
import { setStorageMessage } from '../../services/messages';
import SenderInput from '../SenderInput';
import Employees from '../Employees/Employees';
import HomeContent from '../HomeContent/HomeContent';

const Main = ({ socket }) => {
  const [hostDevice, setHostDevice] = useState({});
  const [displayChat, setDisplayChat] = useState({});
  const [contacts, setContacts] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);

  const [openChats, setOpenChats] = useState([]);

  const [visible, setVisible] = useState(false);

  const [focused, setFocused] = useState([]);
  const [greenChats, setGreenChats] = useState([]);

  useEffect(() => {
	console.log(greenChats);
  }, [greenChats]);

  useEffect(() => {
    socket.emit("join", { name: getUsername() }, getCompany())
  }, [])

  useEffect(() => {
    socket.emit("askOldMessages", { name: getUsername() }, getCompany())
  }, [])

  useEffect(() => {
    setOpenChats(Object.keys(displayChat))
  }, [displayChat])

  useEffect(() => {
    socket.on('apiSendFirst', data => {
      setHostDevice(data.hostDevice);
      const allChatsWithMessages = data.allChatsWithMessages;
      
      let contactsAux = []
      let messagesAux = []
      let unreadAux   = []
      
      allChatsWithMessages.map(chatWithMessage => {

        let msgs = chatWithMessage.msgs;

        if(chatWithMessage.unreadCount > 0){
          unreadAux.push(chatWithMessage.id);
          setDisplayChat({...displayChat, [chatWithMessage.id] : false})
        }

        contactsAux.push({
          id: chatWithMessage.id,
          name: chatWithMessage.name,
          unreadCount: chatWithMessage.unreadCount
        });

        msgs.map(msg => {
          if(msg.type != "e2e_notification" && msg.type != "document"){
            messagesAux.push({
              msgContent: msg.body,
              type: msg.type,
              from: msg.from,
              clientUrl: msg.clientUrl,
              to: msg.to,
              timestamp: msg.t,
              isMedia: msg.isMedia,
              mediaKey: msg.mediaKey,
              size: msg.size,
              height: msg.height ? msg.height : "0",
              width: msg.width ? msg.width : "0"
            });
         }
         if(msg.type == "image"){
              console.log(msg);
          }
        })

      })
      
      setContacts(contactsAux);
      setMessages(messagesAux);
      setUnreadMessages(unreadAux);
      setClients(unreadAux);
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
      if (!displayChat[data.from] && !unreadMessages.includes(data.from))
        setUnreadMessages(unreads => [...unreads, data.from])
      setStorageMessage(data);
      setMessages(msgs => [...msgs, data]);
      setClients(clients => [...new Set([...clients, data.from])]);
	  addChat(data.from);
	  if(!focused.includes(data.from)) {
	  	setGreenChats(greenChats => [...new Set([...greenChats, data.from])]);
	  }
    })
  }, [])

<<<<<<< HEAD
  const focus = (client) => {
	setFocused([client]);
	setGreenChats(greenChats => greenChats.filter(gc => gc !== client));
  }

  var className = 'main';
  className = collapse ? className += ' collapse' : className;
=======
  // var className = 'main';
  // className = collapse ? className += ' collapse' : className;
>>>>>>> c8564c474c8d7f3cb8ae012a0fd985fcaafec507

  return (
    <div className="main">
      <ContactsNav visible={visible} setVisible={setVisible} contacts={contacts} setClients={setClients} displayChat={displayChat} setDisplayChat={setDisplayChat} />
      <LeftPanel
        clients={clients}
        setClients={setClients}
        displayChat={displayChat}
        setDisplayChat={setDisplayChat}
        visible={visible}
        setNavVisible={setVisible}
        contacts={contacts}
        unreadMessages={unreadMessages}
        setUnreadMessages={setUnreadMessages}
      />
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#E0E0E0", position: "relative" }}>
        <TopBar />
        <div style={{ display: "flex", height: "100%" }}>
          <div id="main-content">
            {window.location.pathname == "/employees" ?
              <Employees /> :
              hostDevice != {} ?
                <HomeContent clientsLength={clients.length} contactsLength={contacts.length} hostDevice={hostDevice} /> : null
            }
          </div>
          {hostDevice.wid && openChats.map(client => {
            const hash = shortid.generate()
            return (
              <div onClick={() => focus(client)} key={client} className="containerMother" style={{ width: "-webkit-fill-available", position: "relative", display: (displayChat[client] ? "block" : "none") }}>
                <Chat
                  key={hash}
                  messages={messages.filter(message => (
                    message.from === client || (message.from === hostDevice.wid && message.to === client)
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
				  green={greenChats.includes(client)}
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
      {socket => <Main {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
}

export default MainWithSocket;