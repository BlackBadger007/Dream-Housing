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
    // console.log(params.receiver);
    // console.log(auth.currentUser.uid);

    const [msg , setMsg] = useState('')
    const [sentData , setSentData] = useState([])
    const [receivedData , setReceivedData] = useState([])
    const [counterReply , setCounterReply] = useState('');

    // const [receiver , setReceiver] = useState("xkvEtJG7koNfjIgrllQDK8YgVg63")
    // const [receiver , setReceiver] = useState("yNsImSpHOsNOswMb7DaR3LaMkBi2")
    const [receiver , setReceiver] = useState(params.receiver)
    const [loading , setLoading] = useState(false)

const fetchData1 = async () => {

    // setLoading(true)

    let rData = []
    
    const rq = query(collection(db, "messages"), 
    // where("senderUID", "==", receiver) , 
    where('receiverUID' , "==" , auth.currentUser.uid ) , 
    orderBy("timestamp" , "asc" ) );

    const rquerySnapshot = await getDocs(rq);
    rquerySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    rData.push({
        id : doc.id,
        info : doc.data(),
    })

    });


    // let sData = []

    // const sq = query(collection(db, "messages"), where("senderUID", "==", auth.currentUser.uid ) , where('receiverUID' , "==" , receiver ) , orderBy("timestamp" , "asc" ) );

    // const squerySnapshot = await getDocs(sq);
    // squerySnapshot.forEach((doc) => {
    // // doc.data() is never undefined for query doc snapshots
    // // console.log(doc.id, " => ", doc.data());
    // sData.push({
    //     id : doc.id,
    //     info : doc.data(),
    // })

    // });

    // setReceivedData(rData)
    // setSentData(sData)
    
}






    useEffect(() => {

        const fetchData = async () => {
        
            let rData = []
            
            const rq = query(collection(db, "messages"), 
            // where("senderUID", "==", receiver) , 
            where('receiverUID' , "==" , auth.currentUser.uid ) ,
            // where('date' , "==" , "9/11/2024" )
            // orderBy("date" , "asc" ) ,
            // orderBy("time" , "asc") 
        );
        
            const rquerySnapshot = await getDocs(rq);
            rquerySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
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

    // console.log(sentData);

    // const onChange = (e) => {
    //     setMsg(e.target.value)
    // }

    // const send = async (e) => {
    //     e.preventDefault()
    //     setMsg('')
    //     const docRef = await addDoc(collection(db, "messages"), {
    //         text: msg,
    //         timestamp :  serverTimestamp(),
    //         senderUID: auth.currentUser.uid,
    //         receiverUID : receiver
            
    //       });

    //       fetchData()

    // }

    // return(
        
        // <div className="msg">

        //     <div className="box" style={{display:'flex'}} >

        //         <div className="receive" style={{width:'400px' , height:'400px', backgroundColor:'yellow', margin:'0px 10px' }} >
        //         {receivedData.length > 0 ? <>
        //                 {
        //                     receivedData.map((item) => (
        //                         <p key={item.id} >{item.info.text}</p>
        //                     ))
        //                 }
        //             </> : <></>}
        //         </div>
        //         <div className="sent"  style={{width:'400px' , height:'400px' , backgroundColor:'yellow' , margin:'0px 10px' }} >
        //             {sentData.length > 0 ? <>
        //                 {
        //                     sentData.map((item) => (
        //                         <p key={item.id} >{item.info.text}</p>
        //                     ))
        //                 }
        //             </> : <></>}
        //         </div>

        //     </div>




        //     <div className="enter" style={{width:'fit-content' , padding:'20px 20px' , margin:'auto', backgroundColor:'navy' , position:'static' , botton:'0px'  , left:'0px' , right:'0px'   }} >
        //         <form onSubmit={send}>
        //             <input type="text" onChange={onChange} value={msg}  />
        //             <button onClick={send} >Send</button>
        //         </form>
        //     </div>

        //     </div>

        console.log(receivedData)

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
                {/* <h1 style={{marginBottom:'15px'}} >Places for {params.login}</h1> */}
                {/* {loading ? <>loading...</> : <> */}
                {/* {loading ? <Buffer/> : <> */}
                {receivedData !== null ? <>
                <div className="card-container">
                    <ToastContainer/>
    
                    <div className="bar" style={{ width:'820px', justifyContent:'space-between'   }} >
                <h1 style={{marginBottom:'15px'}} >Notifications ({receivedData.length})</h1>
                {/* <button onClick={() => navigate(`/chats/${auth.currentUser.uid}`)} >Chats</button> */}
                <div className="joint" >
                <button className="back" onClick={() => navigate('/chats')} >Chats</button>
                {/* <button className='back' onClick={()=>navigate('/profile')} >Back</button> */}
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