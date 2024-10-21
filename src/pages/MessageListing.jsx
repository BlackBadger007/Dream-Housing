import { FaChevronDown  } from "react-icons/fa6";
import { FaChevronUp  } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { useState , useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { FaPaperPlane } from "react-icons/fa6";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import Buffer from "../components/Buffer";


function MessageListing ({piece , apple }) {

    const auth = getAuth()
    // console.log(auth.currentUser)

    // const navigate = useNavigate()
    // const params = useParams()
    // console.log(params.receiver);
    
    const [loading , setLoading] = useState(true)

    const [show , setShow] = useState(false)
    const [showArea , setShowArea] = useState(false)
    const [text , setText] = useState('')
    const [data , setData] = useState({})
    // const [img , setImg] = useState('')

    const onChange = (e) => {
        setText(e.target.value)
    }

    const sendChat =  (receiverUID , propertyUID ) => {
        setShow(!show)

        console.log(text , receiverUID  , propertyUID);
        apple(text , receiverUID , propertyUID)

    }


    const fetchData = async () => {

        const docRef = doc(db, "listings", piece.propertyUID );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setData(docSnap.data())
            // setImg(docSnap.data().imgUrls[0])
            // img = docSnap.data().imgUrls[0]
            // setBackground({
            //     backgroundImage : `url(${docSnap.data().imgUrls[0]})`
            // })
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
        setLoading(false)

    }



    useEffect(()=> {
        
        if(piece.propertyUID){
            fetchData()

        }
        
    },[])
      

    if(loading){
        return <Buffer/>
    }else{

    
    return(


        <div className="noti-card"  >
            <div className="noti-start"   >

                <div className="big-clm" style={{ height:'fit-content'}} >
            
                    <div className="clm" style={{display:'flex', height:'fit-content' }} >

                        <div className="noti-img">
                            <img src={piece.senderPhotoUrl} alt="!" id="prof-img" />
                        </div>

                        <div className="noti-sender" style={{display:'block', marginLeft:'15px' }} >
                            <h3 style={{marginTop:'0px'}} >{piece.senderName} ( {piece.date} at {piece.time} ){auth.currentUser.uid !== piece.senderUID ? <FaArrowDown style={{color:'rgb(32, 180, 106)' , fontSize:'20px' , marginLeft:'10px' }} /> : <FaArrowUp style={{color:'rgb(32, 180, 106)' , fontSize:'20px' , marginLeft:'10px' }} /> } </h3>
                            {/* <h4>{piece.date} at {piece.time}</h4> */}
                            <h4>{piece.senderEmail}</h4>
                            <p>{piece.text}</p>
                            {/* <h3>{piece.timestamp}</h3> */}
                        </div>
                    </div>

                    <div className="clm2" style={{display:'flex', marginTop:'10px' }} >



                            {auth.currentUser.uid === piece.senderUID ? <>
                        <div className={showArea ? "visible" : "invisible"} style={{height:'fit-content' , marginTop:'0px' }} >
                            {/* <form onSubmit={sendChat} > */}
                            <textarea onChange={onChange} ></textarea> <br /> 
                            <div className="btm" style={{width:'fit-content' , margin:'auto'}} >
                                 <button onClick={() => sendChat(piece.senderUID , piece.propertyUID)} >{showArea ? <><FaPaperPlane/></> : <></>}</button>
                            </div>
                            {/* </form> */}
                        </div>

                        </> :<></> }

                    {/* {showArea ? <> */}
                        <div className={showArea ? "prop-view" : "prop-view-invi"} style={{ marginLeft:'10px'  }} >
                            {/* {showArea ? <> */}
                            <img src={data.imgUrls[0]} alt=""  id={showArea ? "prop-img" : "prop-img-inv" }/>
                            {/* </> : <></>} */}
                            <h3  >{data.name}</h3>
                            <h4>{data.address}</h4>
                        </div>

                        {/* </> : <></>} */}


                    </div>


                </div>


                

                <div className="noti-btns"  >
                    <button className="cross" ><FaTimes/></button>
                    {/* <button className="more" onClick={() => setShow(!show)} ><FaChevronDown/></button> */}
                    <button className="more" onClick={() => setShowArea(!showArea)} >{!showArea ? <FaChevronDown/> : <FaChevronUp/> } </button>
                    {/* <button className="reply-btn" onClick={() => setShowArea(!showArea)} >Reply</button> */}

                </div>

                
            </div>
                
        </div>
     
    )
}

}
export default MessageListing