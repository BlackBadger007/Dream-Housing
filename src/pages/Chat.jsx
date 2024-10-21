import { getAuth } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { collection, addDoc , query, where , serverTimestamp  , getDocs , doc, orderBy, setDoc , or } from "firebase/firestore"; 
import { db } from "../firebase.config";
import MessageListing from "./MessageListing" 
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Buffer from "../components/Buffer";
import { FaArrowLeft } from "react-icons/fa";


function Chat(){

    const auth = getAuth()
    const navigate = useNavigate()

    const [loading , setLoading] = useState(false)

    const [formData , setFormData] = useState([])

    const fetchData = async () => {

        setLoading(true)
    
        let data = []
        
        const q = query(collection(db, "messages"), 
        or(
            where("senderUID", "==", auth.currentUser.uid) , 
            where('receiverUID' , "==" , auth.currentUser.uid ) , 
        )  
        // orderBy("timestamp" , "asc" ) 
        );
    
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        data.push({
            id : doc.id,
            info : doc.data(),
        })
    
        });

        setFormData(data)
        setLoading(false)
    }

        useEffect(() => {fetchData()} , [])
    


        const value = async (text , receiverUID , propertyUID) => {

            setLoading(true)

            const date = new Date().toLocaleDateString()
            const time = new Date().toLocaleTimeString()

            const docRef = await addDoc(collection(db, "messages"), {
            text,
            date,
            time,
            timestamp : serverTimestamp(),
            senderName: auth.currentUser.displayName,
            senderPhotoUrl:auth.currentUser.photoURL,
            senderEmail:auth.currentUser.email,
            senderUID : auth.currentUser.uid,
            receiverUID ,
            propertyUID ,

          });

          setLoading(false)
          toast('Response sent')

        }
        
    
        if(loading){
            return <Buffer/>

        }
        else{

        

    return(

        <div className="cate">
                
                {formData !== null ? <>
                <div className="card-container">
                    <ToastContainer/>
    
                    <div className="bar" style={{ width:'820px', justifyContent:'space-between'   }} >
                <h1 style={{marginBottom:'15px'}} >Chats ({formData.length})</h1>
                <button className="cng" onClick={() => navigate(`/message/${auth.currentUser.uid}`)} style={{marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>

    
                    </div>
    
                    {
                        formData.map((item) => (
                            <MessageListing piece={item.info} key={item.id} 
                            apple={value} 
                            />
                        ))
                    }
                </div>
                
                </> : <><h4>no data found yet</h4></>}
            </div>
        
    )
}
}
export default Chat