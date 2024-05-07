import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogTitle } from '@mui/material';


export default function Editcustomer(props) {
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState({
        firstname: '', lastname: '', email: '', streetaddress: ''
    })

    //Päivitetään asiakkaan tila kun props.customer muuttuu
    useEffect(() => {
        if (props.customer) {
            setCustomer(props.customer);
        }
    }, [props.customer]);

    //Tyhjennetään tiedot jotta uutta tietoa voi syöttää. 
    const handleClickOpen = () => {
        setOpen(true);
        if (props.customer) {
            setCustomer({
                firstname: '',
                lastname: '',
                email: '',
                streetaddress: ''
            });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value })
    }
    
    //Päivitetään asiakkaan tiedot
    const updateCustomer = () => {
        props.updateCustomer(customer, props.params.data._links.self.href);
        handleClose();
    }
    return (
        <div>
            <Button color="primary" onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstname"
                        value={customer.firstname}
                        onChange={e => handleInputChange(e)}
                        label="firstname"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="lastname"
                        value={customer.lastname}
                        onChange={e => handleInputChange(e)}
                        label="lastname"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        value={customer.email}
                        onChange={e => handleInputChange(e)}
                        label="email"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="streetaddress"
                        value={customer.streetaddress}
                        onChange={e => handleInputChange(e)}
                        label="streetaddress"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={updateCustomer}>Edit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}