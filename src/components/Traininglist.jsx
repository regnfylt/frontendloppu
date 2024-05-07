import { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TrainingList() {

    dayjs.extend(utc);

    const [trainings, setTrainings] = useState([]);

    useEffect(() => {

        //Luodaan AbortController pyyntöjen keskeyttämistä varten, estämään virheitä.
        const controller = new AbortController();
        const signal = controller.signal;

        //Funktio jolla haetaan asiakasdata
        const fetchCustomer = async (url) => {
            const res = await fetch(url, { signal });
            const data = await res.json()
            return data;
        }

        //Funktio jolla haetaan harjoitustiedot
        const fetchData = async () => {
            try {

                const trainingsRes = await fetch('https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings', { signal });
                const trainingsData = await trainingsRes.json();
                const trainingsList = trainingsData._embedded.trainings;
                let customersData = []

                //Haetaan jokaisen asiakkaan tiedot harjoituksista
                for (const training of trainingsList) {
                    const processCustomer = fetchCustomer(training._links.customer.href)
                    customersData.push(processCustomer)
                }
                //Odotetaan kaikki asiakasdata promiset
                const customersList = await Promise.all(customersData)
                //Lisätään asiakkaiden nimet harjoituksiin
                customersList.forEach((customer, idx) => {
                    trainingsList[idx].customerName = `${customer.firstname} ${customer.lastname}`;
                })

                //Asetetaan harjoituslista "state" päivitetyllä tiedolla
                setTrainings(trainingsList)
            } catch (err) {
                console.error(err)
            }
        }


        //"Mountataan" komponentti 
        fetchData();


        // Jos komponentti ei ole "mounted" se estää fetch pyynnön, jotta ei tapahtuisi virheitä.
        return () => {
            controller.abort();
        }
    }, []);


    //Poistaa harjoituksen kun delete nappia painetaan.
    const deleteTraining = (params) => {
        if (window.confirm("Are you sure")) {
            fetch(params.data._links.training.href, { method: "Delete" })
                .then(response => {
                    if (response.ok) {
                        fetchData();
                    }
                })
        }
    }


    //Määritetään sarakkaille data
    const columnDefs = [
        {
            field: 'date',
            sortable: true,
            filter: true,

            //Formatoidaan päivämäärä UTC-aikaan
            valueFormatter: params => {
                if (params.data.date) {
                    const formattedDate = dayjs.utc(params.data.date).format('DD-MM-YYYY HH:mm');
                    return formattedDate;
                }
                return null;
            }
        },
        { field: 'duration', sortable: true, filter: true },
        { field: 'activity', sortable: true, filter: true },
        { field: 'customerName', sortable: true, filter: true },
        {
            cellRenderer: (params) =>
                <Button size="small" color="error" onClick={() => deleteTraining(params)}>Delete</Button>
            , width: 120
        }
    ];



    return (
        <>
            <h2>Training list</h2>
            <div className="ag-theme-material" style={{ width: 1280, height: 1000 }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </>
    );
}