/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React, {useState} from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import PeopleIcon from "@material-ui/icons/People";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {Link} from 'react-router-dom';
import '../styles/TopOpportunitiesWidget.css'

export default function TopOpportunitiesWidget(props) {
  const [alignment, setAlignment] = useState("leads");
  
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <div className="top-opportunities-widget-container">
      <h2 className="top-opportunities-title"> &nbsp; Top Opportunities </h2>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="toggling"
      >
        <ToggleButton value="leads" aria-label="people">
          <PeopleOutlineIcon />
          <div> &nbsp; Leads</div>
        </ToggleButton>
        <ToggleButton value="accounts" aria-label="centered">
          <PeopleIcon />
          <div> &nbsp; Accounts</div>
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="material-ui-list">
        <List dense={true}>
          {/* list for top leads */}
          {alignment === "leads" &&
            props.topLeads.map( (element,i) => {
              return(
                <div key={i}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {i+1}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={element.name}
                      secondary={`Prospects: ${(element.lead_score) > 90 ? "Excellent " : "Very good"}`}
                    />
                    
                    <ListItemSecondaryAction>
                      <span>
                      {`Score: ${roundToTwo(element.lead_score)}`}
                      </span>
                      <IconButton edge="end" aria-label="delete">
                        <Link to={{ pathname: '/leadprofile', state:{cid:element._id} }}>
                          <OpenInNewIcon/>
                        </Link>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
              );
            })
          }

          

          {/* list for top accounts */}
          
          {alignment === "accounts" && props.topAccounts.map( (element,i) => {
            return(
              <div key={element.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {i+1}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={element.name}
                    secondary={`Prospects: ${(element.acc_score) > 10000 ? "Excellent" : "Very good"}`}
                  />
                  
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <Link to={{ pathname: '/accountprofile', state:{cid:element._id} }}>
                        <OpenInNewIcon/>
                      </Link>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </div>
            );
          })
          }
        </List>
      </div>
    </div>
  );
}

function roundToTwo(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
}