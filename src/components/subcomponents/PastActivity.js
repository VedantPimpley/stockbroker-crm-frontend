import React from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"


export default function PastActivity(props) {
  return(
    <> 
      <h2> Past Activity</h2>
      <div className="pretty-list">
        <ul className="experiences">
          {props.activitiesList.sort( (a,b) => new Date(b.date) - new Date(a.date) ) //sort by most recent
          .map( (element, i) => {
            let cross = null;
            if (element.elapsed) {
              cross=<span> &#10006; </span>
            }
            return (
              <li className="blue" key={i}>
                <div className="where"> {cross} {element.title} </div>
                <span className="when"> {convertIsoDateToDateString(element.date)} </span>
                <p className="description"> {element.body} </p>
             </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}