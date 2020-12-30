/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { BiX } from 'react-icons/bi';
import short from 'shortid';
import SocketContext from '../../context/socketContext';
import { maskPhone } from './maskPhone';
import { getCompany } from '../../services/auth';

const Chat = ({messages, client ,displayChat, hostDevice, setDisplayChat, contacts, unreadMessages, setUnreadMessages, socket, green}) => {
	const [nameContact, setNameContact] = useState("");
	const [localMessages, setLocalMessages] = useState(messages);
	const [scrolled, setScrolled] = useState(false);
	const chatBodyRef = useRef();

	useEffect(() => {
		chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		setNameContact(getNameFromClient());
	}, []);

	useEffect(() => {
        socket.on("apiSendMessages", moreMessages => {
			if(scrolled){
				setLocalMessages(oldArray => [...moreMessages, ...oldArray])
				document.getElementById(`chatBody${client}`).scrollTop = 40 * moreMessages.length
			}
		});
	}, [scrolled])


	function formatTime(time){
		return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
	}

	function getNameFromClient(){
		const contact = contacts.find(function(el){
			return el.id === client;
		})

		return (contact ? contact.name : "");
	}

	function removeClientIfRead(client){
		if(unreadMessages.includes(client)){
			setUnreadMessages(unreadMessages.filter(item => item != client))
		}
	}

	const checkScroll = (event) => {
		const target = event.target;

		if(target.scrollTop == 0){
			socket.emit("frontAskForMessages", {
				number: client,
				token: getCompany()
			});

			setScrolled(true);
		}
	}

	return (
		<div className="container" style={{width : "-webkit-fill-available", position: "relative", display : (displayChat[client] ? "block" : "none")}}>
			<header className="chat-header outer" style={{backgroundColor: green ? '#44ac4a' : '#242424'}}>
				{ nameContact ? 
					(<span className="header-name">{ `${nameContact} (${maskPhone(client)})` }</span>)
					:  
					(<span className="header-name">{ `${maskPhone(client)}` }</span>)
				}
				<button className="close-chat" onClick={ () => {
					setDisplayChat({ ...displayChat, [client] : false });
					removeClientIfRead(client);
				}}><BiX fill="white" /></button>
			
			</header>
			<div id={`chatBody${client}`} ref={chatBodyRef} className="chat-body" onScroll={ checkScroll }>
				{localMessages.map((message) => {
					const hash = short.generate();
					return (
						<div key={hash} className="message" style={ message.from === hostDevice.wid ? {alignSelf: "flex-end", backgroundColor: "#dbf3c6"} : {alignSelf: "flex-start"}}>
							{message.type === 'image' || message.type === 'sticker' ? (
								<>
								<img className="media" src={`data:image/png;base64, ${message.msgContent}`} alt="" />
								<span className="message-time">{ formatTime(new Date(message.timestamp * 1000)) } </span>
								</>
							) : (
								<>
								<span>{ message.msgContent }</span>
								<span className="message-time">{ formatTime(new Date(message.timestamp * 1000)) } </span>
								</>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

const ChatWithSocket = props => {
	return (
		<SocketContext.Consumer>
			{socket => <Chat {...props} socket={socket} />}
		</SocketContext.Consumer>
	)
}

export default ChatWithSocket;