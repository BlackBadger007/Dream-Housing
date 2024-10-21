import { Link } from "react-router-dom"
import { useState } from "react"
import {getAuth , createUserWithEmailAndPassword ,updateProfile } from 'firebase/auth'
import {doc , setDoc , serverTimestamp} from 'firebase/firestore'
import { db } from "../firebase.config"
import { useNavigate } from "react-router-dom"
import { FaEye } from "react-icons/fa"
import Google from "./Google"

function SignUp(){

    const [show , setShow] = useState(false)

    const [formData , setFormData] = useState({
        name:'',
        email:'',
        password:'',
    })

    const {
        name,
        email,
        password,
    } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id] : e.target.value
        }))
    }

    const navigate = useNavigate()
    const onSubmit = async (e) => {
        e.preventDefault()
        
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth , email , password)
        try{
            const user = userCredential.user

            await updateProfile(auth.currentUser, {
                displayName: name,
            })

            await setDoc(doc(db , 'users' , user.uid ), {
                name:name,
                email:email,
                timestamp:serverTimestamp(),
            })

            navigate('/profile')

        }catch(error){
            console.log(error)
        }
        
    }


    return(

        <div className="page-container" >

<div className='header' style={{display:'flex' , backgroundColor:'rgb(32, 180, 106)'}} >
                <h1 style={{fontSize:'35px' , fontWeight:'400' ,color:'white'}} >Dream Housing</h1>
            </div>

        <div className="page">
            <h1>SignUp</h1>

            <form onSubmit={onSubmit}  >
                {/* <label htmlFor="name">Name</label> */}
                <input type="name" id="name" value={name} placeholder="Name"
                 onChange={onChange} 
                />
                <br/>
                {/* <label htmlFor="email">Email</label> */}
                <input type="email" id="email"  value={email} placeholder="Email"
                 onChange={onChange} 
                />
                <br/>
                {/* <label htmlFor="password">Password</label> */}
                <input type={!show ? "password" : "text" } id="password" value={password} placeholder="Password"
                 onChange={onChange} 
                /> <button type="button" style={{position:'relative', right:'50px' , top:'5px' , padding:'0px 0px' , fontSize:'20px' }} onClick={() => setShow(!show)} ><FaEye  /></button>
                <br/>
                <div className="page-btn">
                <button onClick={onSubmit} className="cng" >Submit</button>

                </div>
                <br/>
            </form> 
        </div>

        <div className="options">
                <Link to='/sign-in' >SignIn Instead</Link>
                <p style={{fontSize:'17px', fontWeight:'300', textAlign:'center' }} >OR</p>
                <Google/>
        </div>

        </div>
    )
}
export default SignUp