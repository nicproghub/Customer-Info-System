import Company from './Company.js';
import NewCompany from './NewCompany.js';

function CompanyList(props) {
    const {contact, companies, setCompanies} = props;

	return (
        <div className='phone-list'>             
            <fieldset>              
                <legend>Company List</legend> 
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
            </fieldset>
        </div>
	);
}

export default CompanyList;
