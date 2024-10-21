import { useState ,useEffect } from "react"
import { getAuth } from "firebase/auth"
import { doc, orderBy, setDoc } from "firebase/firestore"; 
import { collection, addDoc , query, where , serverTimestamp  , getDocs } from "firebase/firestore"; 
import { db } from "../firebase.config";
import { onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Buffer from "../components/Buffer";
import { useNavigate } from "react-router-dom";
import MessageListing from "./MessageListing";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { FaArrowLeft } from "react-icons/fa";


function Message(){

    const auth=getAuth()
    const params = useParams()
    const navigate = useNavigate()

    const [msg , setMsg] = useState('')
    const [sentData , setSentData] = useState([])
    const [receivedData , setReceivedData] = useState([])
    const [counterReply , setCounterReply] = useState('');

    const [receiver , setReceiver] = useState(params.receiver)
    const [loading , setLoading] = useState(false)

const fetchData1 = async () => {

   

    let rData = []
    
    const rq = query(collection(db, "messages"),  
    where('receiverUID' , "==" , auth.currentUser.uid ) , 
    orderBy("timestamp" , "asc" ) );

    const rquerySnapshot = await getDocs(rq);
    rquerySnapshot.forEach((doc) => {

    rData.push({
        id : doc.id,
        info : doc.data(),
    })

    });

    
}






    useEffect(() => {

        const fetchData = async () => {
        
            let rData = []
            
            const rq = query(collection(db, "messages"), 
            // where("senderUID", "==", receiver) , 
            where('receiverUID' , "==" , auth.currentUser.uid ) ,
        );
        
            const rquerySnapshot = await getDocs(rq);
            rquerySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            rData.push({
                id : doc.id,
                info : doc.data(),
            })
        
        });
        console.log(rData)

        
            setReceivedData(rData)
            
        }

        fetchData()

    } , [] )

        const value = async (text , receiverUID , propertyUID) => {

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

          toast('Response sent')

        }

        return(
            <div className="cate">
             
                {receivedData !== null ? <>
                <div className="card-container">
                    <ToastContainer/>
    
                    <div className="bar" style={{ width:'820px', justifyContent:'space-between'   }} >
                <h1 style={{marginBottom:'15px'}} >Notifications ({receivedData.length})</h1>
                <div className="joint" >
                <button className="back" onClick={() => navigate('/chats')} >Chats</button>
                <button className="cng" onClick={() => navigate('/profile')} style={{marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>


                </div>
    
                    </div>
    
                    {
                        receivedData.map((item) => (
                            <MessageListing piece={item.info} key={item.id} apple={value} />
                        ))
                    }
                </div>
                
                </> : <><h4>no data found yet</h4></>}
            </div>
        )
        
}
export default Message