import { Navigate , Outlet } from "react-router-dom"
import HousingContext from "../context/HousingContext"
import { useContext } from "react"
import { getAuth , onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Buffer from "./Buffer";

function PrivateRoute(){

    // const [loading , setLoading] = useState(false)
    // const navigate = useNavigate()
    // const auth = getAuth()
      
    //   useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {    
    //           // console.log(user.uid)  
    //         // setUid(user.uid)   
    //         setLoading(true)
    //         } else {
    //           navigate('./sign-in')
    //         }
    //       })

    // } , [])

    const{ log , checkingStatus } = useContext(HousingContext)

    // const kite = true

    if(checkingStatus){
        return <Buffer/>
    }else{
        return log ? <Outlet/> : <Navigate to='/sign-in'/>
    }

}
export default PrivateRoute