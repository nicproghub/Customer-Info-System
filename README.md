# README.md

A web application for managing customer contact information, including personal details, phone records and companies detail. It allows users to perform CRUD (Create, Read, Update, Delete) operations on customer records and companies record, making it a practical tool for businesses to maintain and organize customer information. 

1.**Modify the contacts Table to include more attributes.**

`***Code Section:***`
 - Change **/api/app.js**
```bash
 db.sequelize.sync({force: true}).
 ```
 - Change **/api/models/contact.model.js** 

```bash
module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.TEXT
        },
    });
  
    return Contact;
};
```
 - Change **/api/controllers/contact.controller.js** 

```bash
const contact = {
    name: req.body.name,
    address: req.body.address
};
```
 - Change back **/api/app.js** after sync
```bash
 db.sequelize.sync({force: false}).
```

`***Output***`

```bash
postgres=# \d contacts

                                      Table "public.contacts"
  Column   |           Type           | Collation | Nullable |               Default                
-----------+--------------------------+-----------+----------+--------------------------------------
 id        | integer                  |           | not null | nextval('contacts_id_seq'::regclass)
 name      | character varying(255)   |           |          | 
 address   | text                     |           |          | 
 createdAt | timestamp with time zone |           | not null | 
 updatedAt | timestamp with time zone |           | not null | 

Indexes:
    "contacts_pkey" PRIMARY KEY, btree (id)
Referenced by:
    TABLE "companies" CONSTRAINT "companies_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES contacts(id)
```

2.**Modify the phones Table to include more attributes.** 

`***Code Section:***`

 - Change **/api/app.js**
```bash
 db.sequelize.sync({force: true}).
 ```
 - Change **/api/models/phone.model.js** 
 Phone type: use attribute name "name" as phone type. 
```bash
module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phonetype: {
            type: Sequelize.STRING
        },
        number: {
            type: Sequelize.STRING
        },
        contactId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'contacts',
                key: 'id',
            }
        }
    });
  
    return Phone;
};
```
 - Change **/api/controllers/phone.controller.js** 

```bash
const phone = {
    phonetype: req.body.phonetype,
    number: req.body.number,
    contactId: parseInt(req.params.contactId)
};
```
 - Change back **/api/app.js** after sync
```bash
 db.sequelize.sync({force: false}).
```

`***Output***`

```bash
 \d phones
                                      Table "public.phones"
  Column   |           Type           | Collation | Nullable |              Default               
-----------+--------------------------+-----------+----------+------------------------------------
 id        | integer                  |           | not null | nextval('phones_id_seq'::regclass)
 phonetype | character varying(255)   |           |          | 
 number    | character varying(255)   |           |          | 
 contactId | integer                  |           |          | 
 createdAt | timestamp with time zone |           | not null | 
 updatedAt | timestamp with time zone |           | not null | 
Indexes:
    "phones_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "phones_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES contacts(id)
```

3.**Adjust the Front-End to align with the updated backend structure.**

`***Change Front-End Codes for Contacts Model***` 

- Change **/fontend/src/components/NewContact.js:**

```bash
import { useState } from 'react';

function NewContact(props) {
    const {contacts, setContacts} = props;
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    async function createContact(e) {
        e.preventDefault();

        const response = await fetch('http://localhost/api/contacts', {
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
            setContacts([...contacts, data]);
        }

        setName('');
        setAddress('');
    }

	return (
        <form className='new-contact' onSubmit={createContact}>
            <input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} value={name}/>
            <input type='text' placeholder='Address' onChange={(e) => setAddress(e.target.value)} value={address}/>            
            <button className='button green' type='submit'>Create Contact</button>
        </form>
	);
}

export default NewContact;  
```

- Change **/fontend/src/components/Contact.js:**

```bash

<div className='title'>
    <h3> Name: {contact.name}</h3>
</div>   
<div className='title'>
    <h3> Address: {contact.address}</h3>    
</div>
```

`***Interface Output:***`

<img width="212" alt="image" src="https://github.com/user-attachments/assets/cbc40a3b-4349-4308-9361-81910d156bc4">


`***Change Front-End Codes for Phones Model***`

- Change **/fontend/src/components/NewPhone.js:**
 
```bash
import { useState } from 'react';

function NewPhone(props) {
    const {contact, phones, setPhones} = props;
    const [number, setNumber] = useState('');
    const [phonetype, setPhonetype] = useState('Home');

    async function createPhone(e) {
        e.preventDefault();

        const response = await fetch('http://localhost/api/contacts/' + contact.id + '/phones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number,
                phonetype
            })
        });

        const data = await response.json();

        if (data.id) {
            setPhones([...phones, data]);
        }

        setNumber('');

    }

	return (
        <form onSubmit={createPhone} onClick={(e) => e.stopPropagation()} className='new-phone'>
            <select name='name' onChange={(e) => setPhonetype(e.target.value)} >
                <option value='Home'>Home</option>
                <option value='Work'>Work</option>
                <option value='Mobile'>Mobile</option>
                <option value='Others'>Others</option>                
            </select>
            <input type='text' placeholder='Phone Number' onChange={(e) => setNumber(e.target.value)} value={number}/>
            <button className='button green' type='submit'>Add {contact.name}'s Phone</button>
        </form>
	);
}

export default NewPhone;
```

- Change **/fontend/src/components/Phone.js:**

```bash
//Phone Type
<td>{ phone.phonetype}</td>
<td>{ phone.number }</td>
```

`***Interface Output:***`

<img width="287" alt="image" src="https://github.com/user-attachments/assets/f8f17ab2-dc9b-4062-9327-a75000ae8979">


4.**Test All APIs related to table modified contacts and phones(a total of 8 APIs).**

- **Show All Contacts**

`***Run Command in Terminal :***`

```bash
http GET localhost/api/contacts
```

`***Output:***`

![alt text](image-20.png)

- **Add Contact**

`***Run Command in Terminal :***`

   ```bash
http POST localhost/api/contacts name="Louis M" address="13 Flinder Street"
   ```
`***Output:***`

![alt text](image-21.png)

-	**Delete Contact**

`***Run Command in Terminal :***`

   ```bash
http DELETE localhost/api/contacts/6
   ```
`***Output:***`

![alt text](image-22.png)


-	**Update Contact**

`***Run Command in Terminal :***`

   ```bash
http PUT localhost/api/contacts/2 name="Ammie" address="13 Flinder Street"
   ```
`***Output:***`

![alt text](image-23.png)

-	**Show Phones**

`***Run Command in Terminal :***`

   ```bash
http GET localhost/api/contacts/1/phones
   ```
`***Output:***`

<img width="419" alt="image" src="https://github.com/user-attachments/assets/b812de59-0274-4375-8f2e-464cb995094e">


-	**Add Phone**

`***Run Command in Terminal :***`

   ```bash
http POST localhost/api/contacts/2/phones number="12345", name="Home"
   ```

`***Output:***`

<img width="454" alt="image" src="https://github.com/user-attachments/assets/00bd0ed2-b3b1-4666-8881-43c2e2a9e03e">


-	**Delete Phone**

`***Run Command in Terminal :***`

   ```bash
http DELETE localhost/api/contacts/2/phones/6
   ```
`***Output:***`

![image](https://github.com/user-attachments/assets/b726dd92-5294-4fbd-bc7e-4b62382ba699)


-	**Update Phone** 

`***Run Command in Terminal :***`

   ```bash
http PUT localhost/api/contacts/2/phones/36 phonetype="Work" number="1111"

   ```
`***Output:***`

<img width="454" alt="image" src="https://github.com/user-attachments/assets/a52276d5-81e8-42a1-9ca0-ceaf694e9a3e">



## Task 4 EXPANDING THE EXISTING TABLES 
1.**Table Creation: Create a new table named `companies`.**

`***Code Section:***`
 - Change **/api/app.js**
```bash
 db.sequelize.sync({force: true}).
 ```

 - Add line **/api/models/index.js**
```bash
db.companies = require("./company.model.js")(sequelize, Sequelize);
```
 - Create **/api/models/company.model.js** 
Create `company` model to database 
```bash
module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("company", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.TEXT
        },
        contactId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'contacts',
                key: 'id',
            }
        }
    });
  
    return Company;
};
```
 - Create **/api/controllers/company.controller.js** 

```bash
const db = require("../models");
const companies = db.companies;
const Op = db.Sequelize.Op;

// Create company
exports.create = (req, res) => {
    const company = {
        name: req.body.name,
        address: req.body.address,
        contactId: parseInt(req.params.contactId)
    };

    companies.create(company)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred"
            });
        });
};

// Get all companies
exports.findAll = (req, res) => {

    companies.findAll({
        where: {
            contactId: parseInt(req.params.contactId)
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

// Get one company by id
exports.findOne = (req, res) => {
    companies.findOne({
        where: {
            contactId: req.params.contactId,
            id: req.params.companyId
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};

// Update one company by id
exports.update = (req, res) => {
    const id = req.params.companyId;

    companies.update(req.body, {
        where: { id: id, contactId: req.params.contactId }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Company was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Company`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Company with id=" + id
        });
    });
};

// Delete one company by id
exports.delete = (req, res) => {
    const id = req.params.companyId;

    companies.destroy({
        where: { id: id, contactId: req.params.contactId }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Company was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Company`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Company with id=" + id
        });
    });
};
```

 - Create **/api/routes/companies.routes.js** 
 Set up API routing
 ```bash
 module.exports = app => {
    const companies = require("../controllers/company.controller.js");
  
    var router = require("express").Router();
  
    router.post("/contacts/:contactId/companies", companies.create);
  
    router.get("/contacts/:contactId/companies", companies.findAll);
  
    router.get("/contacts/:contactId/companies/:companyId", companies.findOne);
  
    router.put("/contacts/:contactId/companies/:companyId", companies.update);
  
    router.delete("/contacts/:contactId/companies/:companyId", companies.delete);
  
    app.use('/api', router);
};
```

 - Change back **/api/app.js** after sync
```bash
 db.sequelize.sync({force: false}).
```

 - Change the "Detele" function in **/api/controllers/company.controller.js**
When a contact is deleted, the corresonding Phones and Companies will also delete. 

```bash
/ Delete one contact by id
exports.delete = (req, res) => {
    const id = parseInt(req.params.contactId);

    Phones.destroy({
        where: { contactId: id }
    })
    .then (num => {
        Companies.destroy({
            where: { contactId: id}
        })
    })
    .then(num => {
        Contacts.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Contact was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Contact`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Contact with id=" + id
            });
        });
    });
};

```

`***Output***`

```bash
postgres=# \dt
List of relations
 Schema |   Name    | Type  |  Owner   
--------+-----------+-------+----------
 public | companies | table | postgres
 public | contacts  | table | postgres
 public | phones    | table | postgres
(3 rows)

postgres=# \d companies
                Table "public.companies"
  Column   |           Type           | Collation | Nullable |                Default                
-----------+--------------------------+-----------+----------+---------------------------------------
 id        | integer                  |           | not null | nextval('companies_id_seq'::regclass)
 name      | character varying(255)   |           |          | 
 address   | text                     |           |          | 
 contactId | integer                  |           |          | 
 createdAt | timestamp with time zone |           | not null | 
 updatedAt | timestamp with time zone |           | not null | 
Indexes:
    "companies_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "companies_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES contacts(id)


```

2.**API Creation: Develop four APIs to manage records in the companies table, like Task 2.**

-	**Show Companies**

`***Run Command in Terminal :***`

   ```bash
http GET localhost/api/contacts/1/companies
   ```
`***Output:***`

![alt text](image-33.png)


-	**Add Company**

`***Run Command in Terminal :***`

   ```bash
http POST localhost/api/contacts/1/companies name="abc", address="abc address"
   ```

`***Output:***`

![alt text](image-35.png)

-	**Delete Company**

`***Run Command in Terminal :***`

   ```bash
http DELETE localhost/api/contacts/2/companies/4
   ```
`***Output:***`

![alt text](image-37.png)

-	**Update Company** 

`***Run Command in Terminal :***`

   ```bash
http PUT localhost/api/contacts/2/companies/4 address="1asudgi"
   ```

`***Output:***`

![alt text](image-36.png)


## Task 5 FRONT END 
1.**Create a front-end interface to manage the newly created companies table, including functionality for 
adding, editing, deleting, and updating records.**

`***Code Section:***`
 - Change **/fontend/src/components/Contact.js**

```bash
import CompanyList from './CompanyList.js';
```
Inside Contact function: 
```bash
const {contact, contacts, setContacts} = props;
const [expanded, setExpanded] = useState(false);
const [phones, setPhones] = useState([]);
const [companies, setCompanies] = useState([]);

useEffect(() => {
    const fetchPhones = fetch('http://localhost/api/contacts/' + contact.id + '/phones')
        .then(response => response.json())
        .then(data => setPhones(data));
     //fetch Companies List
    const fetchCompanies = fetch('http://localhost/api/contacts/' + contact.id + '/companies')
        .then(response => response.json())
        .then(data => setCompanies(data));      
    
    Promise.all([fetchPhones,fetchCompanies])
        .catch((error) => {
            console.error('Error:', error);
        });
}, []);
```
In elements rendering section: 
```bash
<div style={expandStyle}>
    <hr />
    <PhoneList phones={phones} setPhones={setPhones} contact={contact} />
    <hr />
    <CompanyList companies={companies} setCompanies={setCompanies} contact={contact} />               
</div>
```
 - Add **/fontend/src/components/CompanyList.js**

 ```bash
import Company from './Company.js';
import NewCompany from './NewCompany.js';

function CompanyList(props) {
    const {contact, companies, setCompanies} = props;

	return (
        <div className='phone-list'>
            <NewCompany companies={companies} setCompanies={setCompanies} contact={contact} />

            <table onClick={(e) => e.stopPropagation()}>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Company Address</th>
                        <th>Update or Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        companies.map((company) => {
                            return (
                                <Company key={company.id} company={company} companies={companies} setCompanies={setCompanies} contact={contact} />
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
	);
}

export default CompanyList;
 ```

 - Add **/fontend/src/components/Company.js**
 ```bash
import React, { useState } from 'react';

function Company(props) {
    // State for list of all company 
    const { contact, company, companies, setCompanies } = props;

    // State for edit mode 
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(company.name);    
    const [address, setAddress] = useState(company.address);


    async function deleteCompany() {
	//delete company record
        const response = await fetch('http://localhost/api/contacts/' + contact.id + '/companies/' + company.id, {
            method: 'DELETE',
        });
        if (response.ok){
            let newCompanies = companies.filter((p) => p.id !== company.id);
            setCompanies(newCompanies);
        }
    }
    //Update Company record (PUT)
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
 	setIsEditing(false); // Exit edit mode

    }    
    function CancelChange(){
	//re-set Name & Address to original value when 'cancel' is clicked 
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
 ```
 
 - Add **/fontend/src/components/NewCompany.js**

```bash
import { useState } from 'react';

function NewCompany(props) {
    const {contact, companies, setCompanies} = props;
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    async function createCompany(e) {
        e.preventDefault();
	//add company to contact
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
	// update CompaniesList with new add
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
            <button className='button green' type='submit'>Add Company</button>
        </form>
	);
}

export default NewCompany;
```

`***Output***`

Interface showing Company List:

<img width="289" alt="image" src="https://github.com/user-attachments/assets/28d94ecc-798a-4f60-a079-bfe2f32e9b47">


**Update Record**

When "Edit" button was Clicked: 

<img width="281" alt="image" src="https://github.com/user-attachments/assets/ac442d53-3245-4374-8072-3703a0c412c0">


Company Address Updated:

<img width="283" alt="image" src="https://github.com/user-attachments/assets/18c56d27-25a2-4049-b8da-f3c891e31743">

You can update 'Company Name' and/or 'Company Address' in the text fields.   

When "Save" button was clicked, output company list with newly updated record:

<img width="283" alt="image" src="https://github.com/user-attachments/assets/6c8a3674-186a-4b90-9326-5cd73f13d6d8">


**Delete Record**

When "Delete" button next for "AddCom" company was clicked, the resulted company list:

<img width="279" alt="image" src="https://github.com/user-attachments/assets/233142aa-a987-4d4d-92cd-01c950324548">


**Add Record**

Add new Company detail in the Add company section:

<img width="282" alt="image" src="https://github.com/user-attachments/assets/b3f1971f-8ba3-44bb-b156-50509156a7a5">


After "Add Company" button was clicked, output all companies for that contactor include newly added one: 

<img width="279" alt="image" src="https://github.com/user-attachments/assets/c89ed52b-e72f-4f1d-a2b9-61da366bac6b">


2.**Ensure that changes made through the front-end persisted in the database.**

3.**Make sure that the process should be documented, and screenshot should be captioned in 
Readme.md file.** 
