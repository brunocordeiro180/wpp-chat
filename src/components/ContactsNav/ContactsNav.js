import React, { useEffect, useState } from 'react';
import './ContactsNav.css';
import { maskPhone } from '../Chat/maskPhone';
import { BiArrowBack } from 'react-icons/bi';

const ContactsNav = ( {visible, setVisible, contacts, setClients, displayChat, setDisplayChat} ) => {
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState(contacts);

	useEffect(() => {
		(() => {
			setFilter(contacts)
		})()
	}, [])

	useEffect(() => {
		const res = contacts.filter((clientContact) => (
			clientContact.name ? clientContact.name.toLowerCase().includes(search.toLowerCase()) || 
			clientContact.id.includes(search.toLowerCase()) :
			clientContact.id.includes(search.toLowerCase())
    ));
    setFilter(res);
	}, [search])

	return (
		<div id="mySidenav" className="sidenav-contacts" style={{width: visible ? '250px' : '0'}}>
			<a className="closebtn" onClick={() => setVisible(false)}><BiArrowBack /></a>
			<nav id="visitors" style={{paddingTop: "0px"}}>
				<input value={search} onChange={(e) => setSearch(e.target.value)} className="search" placeholder="filtrar" />
				<div className="ui link list-contacts">
					{filter.length >= 1 ? filter.map(contact => {
						return (
							<a 
								key={contact.id}
								className="item"
								onClick={() => {
									setClients(clients => [...new Set([...clients, contact.id])])
									setDisplayChat({ ...displayChat, [contact.id] : true })
									setVisible(false);
								}} 
							>
								<div className="client-name" style={{ display : "flex", flexDirection: "column"}}> 
									<span>{contact.name ? contact.name : maskPhone(contact.id) }</span>
									{contact.name &&  
										<span style={{fontSize : "0.8em"}}>{ maskPhone(contact.id) }</span>
									}
								</div>
							</a>
						)
					}) : contacts.map(contact => (
						<a 
								key={contact.id} 
								className="item"
								onClick={() => {
									setClients(clients => [...new Set([...clients, contact.id])])
									setDisplayChat({ ...displayChat, [contact.id] : true })
									setVisible(false);
								}} 
							>
								<div className="client-name" style={{ display : "flex", flexDirection: "column"}}> 
									<span>{contact.name ? contact.name : maskPhone(contact.id) }</span>
									{contact.name &&  
										<span style={{fontSize : "0.8em"}}>{ maskPhone(contact.id) }</span>
									}
								</div>
							</a>
					))}
				</div>
			</nav>  
		</div>
	)
}

export default ContactsNav;