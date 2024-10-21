import { Link } from "react-router-dom"
import { useState , useContext } from "react"
import {getAuth , signInWithEmailAndPassword } from 'firebase/auth'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom"
import HousingContext from "../context/HousingContext"
// import Google from './img/google.png'
// import { WiDayThunderstorm } from "react-icons/wi";
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

    ////////////////////////////////////////////


    const byGoogle = async () => {

        const provider = new GoogleAuthProvider()

        const auth = getAuth()
        await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log(user)

        // store it in firestore


        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    }


    ////////////////////////////////////////////
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
        // <div className="page">
        //     <h1>SignIn</h1>
        //     <form onSubmit={onSubmit}
        //     >
        //         <label htmlFor="email">Email</label>
        //         <input type="email" id="email" value={email}  onChange={onChange} 
        //         />
        //         <br/>
        //         <label htmlFor="password">Password</label>
        //         <input type="password" id="password" value={password}  onChange={onChange} 
        //         />
        //         <br/>
        //         <button onClick={onSubmit} >Submit</button>
        //         <br/>
        //         <Link to='/sign-up' >SignUp Instead</Link>

        //             <h1>OR</h1>
        //         <br />

        //         <button onClick={byGoogle} ><img src={Google} alt="" style={{width:'50px' , height:'50px'}} /></button>
        //         <h4>firestore data fill is pending from googleauth</h4>
        //     </form>        
        // </div>

        <div className="page-container">


<div className='header' style={{display:'flex' , backgroundColor:'rgb(32, 180, 106)'}} >
                <h1 style={{fontSize:'35px' , fontWeight:'400' ,color:'white'}} >Dream Housing</h1>
            </div>



        <div className="page">
            <h1>SignUp</h1>

            <form onSubmit={onSubmit}  >
                {/* <label htmlFor="name">Name</label> */}
                {/* <input type="name" id="name" value={name} placeholder="Name"
                 onChange={onChange} 
                />
                <br/> */}
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
                <Link to='/sign-up' >SignUp Instead</Link>
                <p style={{fontSize:'17px', fontWeight:'300', textAlign:'center' }} >OR</p>
                <Google/>
        </div>

        </div>

    )
}
export default SignIn