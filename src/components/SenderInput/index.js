import React, { useState } from 'react';
import { BiSend } from 'react-icons/bi';
import SocketContext from '../../context/socketContext';
import { getCompany } from '../../services/auth';
import './styles.css';

function SenderInput({ hostDevice, client, setMessages, setStorageMessage, addChat, socket }) {
  const [message, setMessage] = useState('');
  const [fileContent, setFileContent] = useState(null);

  function handleChange(e) {
		setMessage(e.target.value)
  }
  
  const sendMessage = (client, message) => {
    const msg = { msgContent: message, from: hostDevice.wid, to: client, timestamp: new Date().getTime()/1000 }
		if(socket.emit('frontSend', {
        room : getCompany(),
        data: msg
      })){
			setStorageMessage(msg);
			addChat(client);
		}
  }

  const sendFileAsBase64 = (e) => {
    let file = e.target.files;

    if(file.length !== 0) {
      let reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = () => {
        let fileInfo = {
          name: file[0].name,
          type: file[0].type,
          size: Math.round(file[0].size / 1000) + ' kB',
          base64: reader.result,
          file: file[0],
        }
        socket.emit('frontSendFile', {
          room: getCompany(),
          data: {
            base64: fileInfo.base64,
            to: client,
            filename: fileInfo.name,
            caption: ''
          }
        })
        setMessages(msgs => [...msgs, {msgContent: fileInfo.base64, from : hostDevice.wid, type: 'image' , to: client, timestamp : new Date().getTime()/1000}]);
        setStorageMessage({msgContent: fileInfo.base64, from: hostDevice.wid, to: client, type: 'image', timestamp: new Date().getTime()/1000});
      }
    } else {
      return
    }
  }
  
  function handleSubmit(e) {
		e.preventDefault()
		sendMessage(client, message);
    setMessages(msgs => [...msgs, {msgContent: message, from : hostDevice.wid , to: client, timestamp : new Date().getTime()/1000}]);
    setMessage('')
	}

  return (
    <form
      onSubmit={handleSubmit}
      className="chat-footer send-message-form"
    >
      <input 
        onChange={handleChange}
        value={message ? message : ''} 
        type="text" 
        placeholder="Responder..." 
      />
      
      <div>
        {/* <div>
          <input
            value={fileContent ? fileContent : ''}
            type="file"
            accept="image/png, image/jpeg"
            onChange={sendFileAsBase64}
            multiple={false}
          />
        </div> */}

        <button>
          <BiSend className="icon-send" />
        </button>
      </div>
    </form>
  );
}

const SenderInputWithSocket = props => {
	return (
		<SocketContext.Consumer>
			{socket => <SenderInput {...props} socket={socket} />}
		</SocketContext.Consumer>
	)
}

export default SenderInputWithSocket;