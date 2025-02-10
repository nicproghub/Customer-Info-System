import { useState } from 'react';

function NewCompany(props) {
    const {contact, companies, setCompanies} = props;
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    async function createCompany(e) {
        e.preventDefault();

        const response = await fetch('http://localhost/api/contacts/' + contact.id + '/companies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                address
            })
        });

        const data = await response.json();

        if (data.id) {
            setCompanies([...companies, data]);
        }

        setName('');
        setAddress('');

    }

	return (
        <form onSubmit={createCompany} onClick={(e) => e.stopPropagation()} className='new-phone'>
            <input type='text' placeholder='Company Name' onChange={(e) => setName(e.target.value)} value={name}/>
            <input type='text' placeholder='Company Address' onChange={(e) => setAddress(e.target.value)} value={address}/>
            <button className='button green' type='submit'>Add {contact.name}'s Company</button>
        </form>
	);
}

export default NewCompany;