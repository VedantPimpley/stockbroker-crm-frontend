/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React from 'react';
import '../styles/LeadProfileHeader.css';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Tooltip } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Link} from 'react-router-dom';
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
export default class LeadProfileHeader extends React.Component {
  state = {
    open: false,
    submitted: false,
    demat_accno: 0,
    trading_accno: 0,
    newId: 0, //set after lead converts to account
  }

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleOpen = () => {
    if (this.props.leadStatus === "Contacted") {
      this.setState({ open:true });
    }
  };

  handleClose = () => {
    this.setState({ open:false });
  };

  handleCloseSecondary = () => {
    this.setState({ submitted:false });
  }

  transitionLeadToAccount = async () => {
    const fields = {
      demat_accno: this.state.demat_accno,
      trading_accno: this.state.trading_accno,
      _id : this.props._id,
      contact_comm_type: "Email",
      latest_order_stage: 0,
      last_contact: new Date(),
    }

    fetch(`${API}/main/convert_lead_to_account`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(fields)
    })
    .then( response => {
      if (response.ok && this._isMounted) {
        this.setState({ open:false });
        this.setState({ submitted: true });
        response.text().then( text => this.setState({ newId: text }) )
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))    
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id] : event.target.value 
    });
  }

  render() {
    return(
      <>
        <span className="profile-name"> {this.props.name} </span>
        <span className="stage-indicator">
          <span 
           className="stage1" 
           onClick={this.props.onDivClick} 
           id="Uncontacted"
           style={ this.props.leadStatus==="Contacted" ? {backgroundColor:"#4caf50"} : {backgroundColor:"#1976d2"} }
          >
            <span id="Uncontacted" className="stage-name"> Uncontacted </span>
          </span>  

          <span 
           className="stage2" 
           onClick={this.props.onDivClick} 
           id="Contacted"
           style={ this.props.leadStatus==="Contacted" ? {backgroundColor:"#1976d2"} : {backgroundColor:"gray"} }
          > 
            <span id="Contacted" className="stage-name"> Contacted </span>
          </span>  

          <span style={{ verticalAlign: "middle" , cursor: "pointer"}}>
            <Tooltip title="Lead created account" arrow>
              <CheckCircleIcon onClick={this.handleOpen} />
            </Tooltip>
          </span>
        </span> 

        {/* Form dialog */}

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Convert Lead to Account holder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="demat_accno"
              label="Demat Account No."
              type="number"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />

            <TextField
              autoFocus
              margin="dense"
              id="trading_accno"
              label="Trading Account No."
              type="number"
              variant="outlined"
              fullWidth
              onChange={this.handleChange}
            />
            
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.transitionLeadToAccount} color="primary">
            Confirm
          </Button>
        </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.submitted}
          onClose={this.handleCloseSecondary}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title"> Redirect </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Proceed to new Account Profile or return to Leads page?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to={{pathname:'./leads'}}>
              <Button onClick={this.handleCloseSecondary} color="primary">
                Return
              </Button>
            </Link>
            <Link to={{pathname:'./AccountProfile', state:{ cid:this.state.newId }}}>
              <Button onClick={this.handleCloseSecondary} color="primary" autoFocus>
                Proceed
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </>
    );
  }  
}