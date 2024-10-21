import { getAuth, signInWithPopup, GoogleAuthProvider , getAdditionalUserInfo  } from "firebase/auth";
import GoogleIcon from './img/google.png'
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css' 
import { useNavigate } from "react-router-dom";
import { setDoc , doc , serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase.config";

function Google () {

    const auth = getAuth()
    const navigate = useNavigate()
    const provider = new GoogleAuthProvider()

    const [value , setValue] = useState('')

    const getGoogle = async () => {
        await signInWithPopup(auth , provider) .then ((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            // The signed-in user info.
            const user = result.user
            console.log(user);
            const value = getAdditionalUserInfo(result)
            console.log(value)
            // setValue(user)

            setDoc(doc(db , 'users' , user.uid ), {
            name:user.displayName,
            email:user.email,
            timestamp:user.metadata.creationTime,
            })

            

            // IdP data available using getAdditionalUserInfo(result)
    
        }).catch((error) => {
            toast(error)
            // Handle Errors here.
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.customData.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          })

          console.log(value)

        //   await setDoc(doc(db , 'users' , user.uid ), {
        //     name:user.displayName,
        //     email:user.email,
        //     timestamp:serverTimestamp(),
        // })

          navigate('/profile')
    }


    return(
        <>
        <div className="google" style={{display:'flex' , width:'fit-content' , margin:'auto'}} >
            <button  onClick={getGoogle} style={{ paddingTop:'5px'}} ><img style={{width:'35px'  , height:'35px'  }} src={GoogleIcon} alt="" /></button>
            <ToastContainer/>
        </div>
        </>
    )
}
export default Google