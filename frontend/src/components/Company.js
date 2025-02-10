import React, { useState } from 'react';

function Company(props) {
    // State for list of all company 
    const { contact, company, companies, setCompanies } = props;

    // State for edit mode and form data
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(company.name);    
    const [address, setAddress] = useState(company.address);

    async function deleteCompany() {
        const response = await fetch('http://localhost/api/contacts/' + contact.id + '/companies/' + company.id, {
            method: 'DELETE',
        });
        if (response.ok){
            let newCompanies = companies.filter((p) => p.id !== company.id);
            setCompanies(newCompanies);
        }
    }

    async function updateCompany() {
        const response = await fetch('http://localhost/api/contacts/' + contact.id + '/companies/' + company.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                address
            })
        });

        if (response.ok) {
            let updatedCompany = await response.json();
            console.log('Server:', updatedCompany);
 
            // re-fetch the updated list of companies
            const companiesResponse = await fetch('http://localhost/api/contacts/' + contact.id + '/companies');
            if (companiesResponse.ok) {
                let updatedCompanies = await companiesResponse.json();
                setCompanies(updatedCompanies);
            }
        }
        //setCompanies(newCompanies);
        setIsEditing(false); // Exit edit mode

    }    

    function CancelChange(){
        setName(company.name);
        setAddress(company.address);
        setIsEditing(false);
    }

    return (
        <tr>
            {isEditing ? (
                <>
                    <td>
                        <input type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)}/>                      
                    </td>
                    <td>
                        <input type="text" name="name" value={address} onChange={(e)=>setAddress(e.target.value)}/>                      
                    </td>
                    <td>
                        <button className="button blue" onClick={updateCompany}>
                            Save
                        </button>
                        <button className="button lightblue" onClick={CancelChange}>
                            Cancel
                        </button>
                    </td>
                </>
            ) : (
                <>
                    <td>{company.name}</td>
                    <td>{company.address}</td>

                    <td style={{ width: '14px' }}>
                        <button className="button seagreen" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className="button seagreen" onClick={deleteCompany}>
                            Delete
                        </button>
                    </td> 
               
                </>
            )}
        </tr>
    );
}

export default Company;
