import { Link } from "react-router-dom"
import { useState , useContext } from "react"
import {getAuth , signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from "react-router-dom"
import HousingContext from "../context/HousingContext"
import { FaEye } from "react-icons/fa";
import Google from "./Google";

function SignIn(){

    const { setLog } = useContext(HousingContext)

    const [show , setShow] = useState(false)

    const [formData , setFormData] = useState({
        email:'',
        password:'',
    })

    const {
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
        try{
            const auth = getAuth()
            const userCredential = await signInWithEmailAndPassword(auth , email , password)
            
            if(userCredential.user){
                setLog(true)
                navigate('/profile')
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        

        <div className="page-container">


<div className='header' style={{display:'flex' , backgroundColor:'rgb(32, 180, 106)'}} >
                <h1 style={{fontSize:'35px' , fontWeight:'400' ,color:'white'}} >Dream Housing</h1>
            </div>



        <div className="page">
            <h1>SignUp</h1>

            <form onSubmit={onSubmit}  >
                
                <input type="email" id="email"  value={email} placeholder="Email"
                 onChange={onChange} 
                />
                <br/>
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
                <Link to='/sign-up' >SignUp Instead</Link>
                <p style={{fontSize:'17px', fontWeight:'300', textAlign:'center' }} >OR</p>
                <Google/>
        </div>

        </div>

    )
}
export default SignIn