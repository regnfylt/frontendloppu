import { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { CSVLink } from "react-csv";
import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';
import Addtraining from './Addtraining';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Customerlist() {

    const [customers, setCustomers] = useState([]);

    //Haetaan asiakasdata kun komponentti "mounttaa"
    useEffect(() => fetchData(), []);


    //Haetaan asiakasdataa
    const fetchData = () => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data._embedded.customers))
            .catch(err => console.error(err))
    }

    //Poistetaan asiakkaan tiedot
    const deleteCustomer = (params) => {
        if (window.confirm("Are you sure")) {
            fetch(params.data._links.customer.href, { method: "Delete" })
                .then(response => {
                    if (response.ok) {
                        fetchData();
                    }
                })
        }
    }

    //Tallennetaan asiakas
    const saveCustomer = (customer) => {
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(response => fetchData())
            .catch(err => console.error(err))
    }

    //Päivitetään asiakkaan tietoja
    const updateCustomer = (customer, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
            .then(response => fetchData())
            .catch(err => console.error(err))
    }

    //Tallennetaan harjoitus asiakkaalle
    const saveTrainingForCustomer = (training, customerLink) => {
        let trainingWithCustomer = { ...training, customer: customerLink }
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trainingWithCustomer)
        })
            .then(response => fetchData())
            .catch(err => console.error(err))
    }

    //Asiakkaan tiedot mapataan exporttia varten
    const csvCustomerData = customers ? customers.map((customer) => ({
        FirstName: customer.firstname,
        LastName: customer.lastname,
        Address: customer.streetaddress,
        Email: customer.email,
    })) : [];

    const [columnDefs, setColumnDefs] = useState([

        { field: 'firstname', sortable: true, filter: true },
        { field: 'lastname', sortable: true, filter: true },
        { field: 'email', sortable: true, filter: true },
        { field: 'streetaddress', sortable: true, filter: true },
        { cellRenderer: (params) => <Addtraining saveTraining={saveTrainingForCustomer} params={params} />, },
        { cellRenderer: (params) => <Editcustomer updateCustomer={updateCustomer} params={params} />, },
        {
            cellRenderer: (params) =>
                <Button size="small" color="error" onClick={() => deleteCustomer(params)}>Delete</Button>
            , width: 120
        }

    ]);

    return (
        <>
            <h2>Customer list</h2>
            <Addcustomer saveCustomer={saveCustomer} />
            <div>
                <CSVLink data={csvCustomerData} filename={"customerlist.csv"} separator={";"}>
                    Download CSV file
                </CSVLink>
            </div>
            <div className="ag-theme-material" style={{ width: 1280, height: 1000 }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </>
    );
}