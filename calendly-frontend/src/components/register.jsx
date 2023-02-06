import React, {useState } from 'react';
import {Route,useNavigate, useHistory} from 'react-router-dom';

const Register = () => {
        const[username, setUsername] = useState()
        const[password, setPassword] = useState()
        const[firstname, setFirstName] = useState()
        const[lastname, setLastName] = useState()
        const[loggedin, setLoggedIn] = useState(true)
        const[followers, setFollowers] = useState(0)
        const [following, setFollowing] = useState(0)
        let navigate = useNavigate();

        const onRegister = async(e) =>{
            e.preventDefault()
            try {
                const body = {username, password, firstname, lastname,loggedin,followers, following}
                console.log(body)
                const response = await fetch("http://localhost:4000/api/users",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify(body)
                })
                navigate('/',{
                    username:username
                })
            } catch (error) {
                console.error(error.message)
            }
        }


        return (
            <div className="register">
                <span>Username:</span><input type="text" onChange={e => setUsername(e.target.value)}/>
                <span>Password:</span><input type="text" onChange={e => setPassword(e.target.value)}/>
                <span>First Name:</span><input type="firstname" onChange={e => setFirstName(e.target.value)}/>
                <span>Last Name:</span><input type="lastname" onChange={e => setLastName(e.target.value)}/>
                <button onClick={onRegister}>Create User</button>
            </div>
        );
    }
 
export default Register;