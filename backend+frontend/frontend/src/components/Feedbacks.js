import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Feedback = (props) => {

    return(
        
        <tr> 
            <td>{props.count}</td>
            <td>{props.isp_name}</td>
            <td>{props.user_name}</td>
            <td>{props.rating}</td>
            <td>{props.feedback_arrival_time}</td>
        </tr>
              
    );
    
}

class Feedbacks extends React.Component {

    state = {
        feedbacks : [],
        isps : [],
        users :[],
        district : undefined,
        division : undefined,
        subdistrict : undefined,
        union : undefined,
        area : undefined,
        time : undefined,
        rating : undefined
    }
  

    componentDidMount() {
        let apiUrl = "http://localhost:7000/nttn/feedbacks/sortBy";

        axios.post(apiUrl,{})
        .then(response => {
          this.setState({ feedbacks: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })
        

        apiUrl = "http://localhost:7000/api/isp";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ isps: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })

        apiUrl = "http://localhost:7000/api/user";
        axios.get(apiUrl)
        .then(response => {
            this.setState({ users: response.data.data })
        })
        .catch((error) => {
          console.log(error);
        })
        
    }

      
    getIspName = (isp_id) => {
       

        for(let i = 0; i < this.state.isps.length; i++){
            if(this.state.isps[i]._id === isp_id){
                return this.state.isps[i].name
            }
        }
    }


    getUserName = (user_id) => {
       

        for(let i = 0; i < this.state.users.length; i++){
            if(this.state.users[i]._id === user_id){
                return this.state.users[i].name
            }
        }
    }

   
    
    render() {
        return(
            <div>
                <center><h3>Feedbacks from Users</h3><br></br></center>
                
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                        <th></th>
                        <th>ISP Name</th>
                        <th>User Name</th>
                        <th>Rating</th>
                        <th>Feedback Arrival Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.feedbacks.map((feedback, index) => {
                           
                            return <Feedback 
                                key={feedback._id} 
                                isp_name={this.getIspName(feedback.isp_id)} 
                                user_name = {this.getUserName(feedback.user_id)} 
                                rating = {feedback.rating} 
                                feedback_arrival_time = {feedback.feedback_arrival_time} 
                                count={index + 1}
                            />})
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Feedbacks