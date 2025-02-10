import { useState, useEffect } from 'react';  // import useEffect
import PhoneList from './PhoneList.js';
import CompanyList from './CompanyList.js';

// This is the code for a single instance of contact 
// one of the instance in the contact list 
function Contact(props) {
    // initilize contact component, receive 'contact' prop
    const {contact, contacts, setContacts} = props;
    //Boolean var determine if the contact detial should be shown or not 
    const [expanded, setExpanded] = useState(false);
    // list phone number associate to contact
    const [phones, setPhones] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchPhones = fetch('http://localhost/api/contacts/' + contact.id + '/phones')
            .then(response => response.json())
            .then(data => setPhones(data));
        const fetchCompanies = fetch('http://localhost/api/contacts/' + contact.id + '/companies')
            .then(response => response.json())
            .then(data => setCompanies(data));      
        
        Promise.all([fetchPhones,fetchCompanies])
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    // control if the phone list is visible 
    const expandStyle = {
        display: expanded ? 'block' : 'none'
    };

    async function doDelete(e) {
        e.stopPropagation();
        
        const response = await fetch('http://localhost/api/contacts/' + contact.id, {
            method: 'DELETE',
        });

        let newContacts = contacts.filter((c) => {
            return c.id !== contact.id;
        });

        setContacts(newContacts);
    }
    
	return (
		<div key={contact.id} className='contact' onClick={(e) => setExpanded(!expanded)}>
            <div className='title'>
                <h3> Name: {contact.name}</h3>
            </div>   
            <div className='title'>
                <h3> Address: {contact.address}</h3>    
            </div>
            <div>                
                <button className='button red' onClick={doDelete}>Delete Contact</button>
            </div>

            <div style={expandStyle}>               
                <hr />
                <PhoneList phones={phones} setPhones={setPhones} contact={contact} />
                <br></br> 
                <hr />
                <br></br> 
                <CompanyList companies={companies} setCompanies={setCompanies} contact={contact} />               
            </div>
        </div>
        //Call phone List & Company List 
	);
}

export default Contact;
