import React, { useState } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function Addtraining(props) {
    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({
        date: null, duration: '', activity: ''
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //Päivämäärän tietojen syöttämiseen ja asettamiseen
    const handleDateChange = (date) => {
        setTraining({ ...training, date });
    };

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    };

    //Lisätään uusi treeni
    const addTraining = () => {
        props.saveTraining(training, props.params.data._links.self.href);
        handleClose();
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>Add Training</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New Training</DialogTitle>
                <DialogContent>
                    <DatePicker
                        autoFocus
                        margin="dense"
                        name="Date"
                        selected={training.date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy HH:mm"
                        timeFormat="HH:mm"
                        label="Date"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={handleInputChange}
                        label="Duration"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={handleInputChange}
                        label="Activity"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={addTraining}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
