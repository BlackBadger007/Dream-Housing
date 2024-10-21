import {createContext , useState} from 'react'
import { getAuth , onAuthStateChanged } from "firebase/auth"
import { useEffect } from "react";

const HousingContext = createContext()

export const HousingProvider = ({children}) => {

    // const [log , setLog] = useState(true)
    // const [lod , setLod] = useState(false)
    const [log , setLog] = useState(false)
    const [checkingStatus , setCheckungStatus] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if (user) {    
              // console.log(user.uid)  
            // setUid(user.uid)   
            setLog(true)
            }
            setCheckungStatus(false)

          })

    } , [])


    return (
        <HousingContext.Provider value={{
            // lod,
            checkingStatus,
            // setLod,
            log,
            setLog,
            // loading,
            // setLoading
        }} >{children}</HousingContext.Provider>
    )
}
export default HousingContext