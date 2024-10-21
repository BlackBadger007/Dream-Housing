import ThumbnailGallery from "../components/PropSwiper/ThumbnailGallery"
import { useState , useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import Buffer from "../components/Buffer";
import { WiDayThunderstorm } from "react-icons/wi";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; 
import { TbSquareRoundedLetterUFilled } from "react-icons/tb";
import { serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {  FaPaperPlane } from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaParking ,FaCouch , FaBed , FaBath , FaGift , FaArrowLeft } from "react-icons/fa";
// import Popup from "reactjs-popup";



function Property(){

    const params = useParams()
    const auth = getAuth()
    const navigate = useNavigate()
    // console.log(params.productId)

    const [loading,setLoading] = useState(true)

    const [propertyInfo , setPropertyInfo] = useState({}) 
    const [ownerInfo , setOwnerInfo] = useState({})

    const [chating , setChating] = useState(false)

    const [show , setShow] = useState(false)
    const [show1 , setShow1] = useState(false)

    const [btnDisabled , setBtnDisabled] = useState(false)

    const [text , setText] = useState('')

    useEffect(() => {

        // setLoading(true)

        const fetchData = async () => {


            const docRef = doc(db, "listings", (params.productId));
            const docSnap = await getDoc(docRef);
            // setPropertyInfo(docSnap.data())


            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                // data1.push(docSnap.data())
                // upd = docSnap.data().uploaderId
                // setLoading(false)
                setPropertyInfo(docSnap.data())
                setChating(docSnap.data().uploaderId)
                // setOwnerInfo(docSnap.data().uploaderId)
                // console.log(propertyInfo);
                
                
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }

            const docRefU = doc(db,'users' , docSnap.data().uploaderId )
            const docSnapU = await getDoc(docRefU)

            // console.log(hi)

            if(docSnapU.exists()){
                // console.log("Document data:", docSnapU.data());
                setOwnerInfo(docSnapU.data())
                // data2.push(docSnapU.data())
            }

            
            // setPropertyInfo(data1)
            // setOwnerInfo(data2)


            // console.log(propertyInfo);
            
            setLoading(false)

        }

        
        fetchData()



        
        
    },[])

    useEffect(() => {
        if(auth.currentUser.uid === propertyInfo.uploaderId ){
            setBtnDisabled(true)
           
        }
    },[propertyInfo])

    // if(navigator.geolocation){
    //     console.log(navigator.geolocation.getCurrentPosition(success , error));
    // }else{
    //     console.log("geolocation not supp");
    // }

    // function success(position) {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    //   }
      
    //   function error() {
    //     console.log("Unable to retrieve your location");
    //   }

    // console.log(show);

    const openChat = () => {
        // setChating(true)
        navigate(`/message/${chating}`)
    }
    const closeChat = () => {
        setChating(false)
    }

    const onChange = (e) => {
        setText(e.target.value)
    }

    const sendChat = async (e) => {
        e.preventDefault()
        setShow(!show)

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
            receiverUID : propertyInfo.uploaderId,
            propertyUID : params.productId,
          });

          toast('Message sent , the owner wil answer shortly')

    }

    useState(() => {console.log(propertyInfo)} , [propertyInfo])

    // Fix for missing default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



    if(loading){
        return <Buffer/>
    }else{
    return (

     


        <div className="property" style={{textAlign:'center'  }}  >
            <ToastContainer/>

            {/* THUMBNAIL */}
                <div className="propswi" style={{height:'550px' , backgroundColor:'white' , marginTop:'10px' , paddingTop:'16px' , borderRadius:'0.5rem' }} >
                    {/* <button className="cng" onClick={() => navigate('/')}  style={{position:'absolute' , top:'20px' , right:'20px' , fontSize:'21px' , width:'80px' }} >Back</button> */}
                    <ThumbnailGallery images={propertyInfo.imgUrls} />

                </div>

                <button className="cng" onClick={() => navigate('/')} style={{position:'fixed' , top:'0px', right:'0px' ,marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>



{/* start */}
            <div className="big-block" style={{display:'flex' , width:'80% ' , margin:'auto'  , height:'418px' , marginTop:'40px' , justifyContent:'space-around' , borderRadius:'0.5rem' , padding:'0px 15px' }} >
            {/* , backgroundColor:'rgb(32, 180, 106)' */}

            

                {/* PROPERTY INFO */}
                <div className="prop-det" style={{  width:'45%' }}  >

                <div className="owner-bar" style={{display:'flex' , justifyContent:'space-between', marginBottom:'10px'  }} >
                    
                    <h3 style={{marginTop:'10px', fontSize:'17px' , fontWeight:'700' }} >Property details</h3>
                    {/* {!btnDisabled ? <>
                    <button className="cng" style={{padding:'0px 10px' ,width:'fit-content' }} onClick={() => setShow(!show)} disabled = {btnDisabled} >Ask Owner</button>
                    </> : <></>} */}
                </div>

                <div className="d1" style={{backgroundColor:'white' , borderRadius:'0.5rem', padding:'10px 20px' , textAlign:'left' }}  >

                

                    <h1 style={{marginTop:'0px'}} >{propertyInfo.name} ({propertyInfo.type === 'sell' ? "Sale" : "Rent" }) </h1>
                    <h2 style={{fontWeight:'400'  }} >{propertyInfo.address} </h2>
                    <h3 style={{fontWeight:'300' , fontSize:'22px'}}>{propertyInfo.bedrooms} Bedrooms <FaBed/> </h3>
                    <h3 style={{fontWeight:'300' , fontSize:'22px'}}>{propertyInfo.bathrooms} Bathrooms <FaBath/></h3>
                    <h3 style={{fontWeight:'300' , fontSize:'22px'}} >{propertyInfo.parking === 'true' ?  <> Parking <FaParking/></>  : <></> } </h3>
                    <h3 style={{fontWeight:'300' , fontSize:'22px'}} >{propertyInfo.furnished === 'true' ?  <> Furnished <FaCouch/></>  : <></> } </h3>
                    <h3 style={{fontWeight:'300' , fontSize:'22px'}} >Price : ${propertyInfo.regularPrice} </h3>

                    {propertyInfo.offer === 'true' && <>

                        <div className="sec">

                            <button style={{color:'rgb(32, 180, 106)'}}  onClick={() => setShow1(!show1)} >Offer <FaGift/> </button>
                            <div className={show1 ? "effect" : 'clear'} >
                                <h4 style={{margin:'0px 0px' , fontWeight:'300' , marginBottom:'4px' }} >Limited time Offer : {propertyInfo.offer === 'true' && (propertyInfo.discountedPrice) } </h4>

                            </div>

                        </div>
                    </>}
                </div>
                </div>

                {/* OWNER INFO */}
                <div className="owner-detail" style={{ width:'45%' , marginBottom:'150px' , height:'fit-content' }} >
                
                    <div className="owner-bar" style={{display:'flex' , justifyContent:'space-between', marginBottom:'10px'  }} >
                    
                        <h3 style={{marginTop:'10px', fontSize:'17px' , fontWeight:'700'  }} >Owner details</h3>
                        {!btnDisabled ? <>
                        <button className="cng" style={{padding:'0px 10px' ,width:'fit-content' }} onClick={() => setShow(!show)} disabled = {btnDisabled} >Ask Owner</button>
                        </> : <></>}
                    </div>


                    <div className="full-half" style={{justifyContent:'center', backgroundColor:'white', borderRadius:'0.5rem' , padding:'10px 20px' , height:'fit-content' }}  >
                            {/* <div className="first-half"  style={{width:'50%' , fontSize:'15px' , fontWeight:'100' , margin:'auto' }} > */}

                                {/* {ownerInfo.length > 0  ? <>

                    
                                    <h4>email : {ownerInfo.email}</h4>
                                    <h4>name : {ownerInfo.name}</h4>

                                </> : <> */}

                                    <div className="block" style={{display:'flex', justifyContent:'space-between', width:'100%' }} >

                                        <div className="b1" style={{ display:'block' , width:'25%' , margin:'auto' , marginTop:'13px' , margin: 'auto' }} >
                                            <img  src={propertyInfo.uploaderPhotoUrl} alt="" style={{width:'fit-content' , height:'110px' , margin:'0px 0px ' , borderRadius:'0.5rem', marginRight:'10px'  }} />
                                        </div>

                                        <div className="b2" style={{ width:'75%' , margin:'auto', textAlign:'left' }} >
                                            <h4 style={{marginTop:'7px'}} >Name : {propertyInfo.uploaderName}</h4>
                                            <h4 >Email : {propertyInfo.uploaderEmail}</h4>
                                            <h4>User since : {propertyInfo.uploaderCreationTime}</h4>
                                        </div>
                            
                                    </div>

                                {/* </> } */}

                            {/* </div> */}

                            <div className={show ? "visiblee" : "invisiblee"} >
                                {/* <form onSubmit={sendChat}> */}
                                    <textarea onChange={onChange}  ></textarea> <br />
                                    <button   onClick={sendChat}  ><FaPaperPlane style={{color:'white'}} id={show  ? "visiblee" : "invisiblee"} /></button>
                                {/* </form> */}
                            </div> 
                    </div>

                </div>

            </div>



      

                {/* MAP */}
                <div className="map-container" style={{textAlign:'left', width:'fit-content', margin:'auto' , marginTop:'53px' }} >
                    <h3 style={{fontSize:'18px', marginBottom:'4px' }} >Location</h3>
                


                <div className="map">

                    {/* <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{width:'700px' , height:'600px'}}  > */}
                    {/* <MapContainer center={[30.2829736, 76.7105632]} zoom={13} scrollWheelZoom={false} style={{width:'700px' , height:'600px', margin:'auto', position:'sticky' }}  > */}
                    {/* <MapContainer center={[30.1518359 ,  77.2970613]} zoom={13} scrollWheelZoom={false} style={{width:'900px' , height:'600px', margin:'auto', position:'sticky' }}  > */}
                    <MapContainer center={[propertyInfo.latitude ,  propertyInfo.longitude]} zoom={13} scrollWheelZoom={false} style={{width:'900px' , height:'600px', margin:'auto', position:'sticky' }}  >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* <Marker position={[51.505, -0.09]}> */}
                        <Marker position={[30.1518359 ,  77.2970613]}>
                        {/* <Marker position={[propertyInfo.latitude , propertyInfo.longitude]}> */}
                        {/* <Popup> */}
                        {/* A pretty CSS3 popup. <br /> Easily customizable. */}
                        {/* </Popup> */}
                        </Marker>
                    </MapContainer>

                </div>
                </div>

        



            {/* <div className="owner-detail" style={{ width:'800px' , marginBottom:'150px' }} >
                
                    <div className="owner-bar" style={{display:'flex' , justifyContent:'space-between', marginBottom:'10px'  }} >
                    
                        <h3 style={{marginTop:'10px', fontSize:'17px' , fontWeight:'700'  }} >Owner details</h3>
                        {!btnDisabled ? <>
                        <button className="cng" style={{padding:'0px 10px' ,width:'fit-content' }} onClick={() => setShow(!show)} disabled = {btnDisabled} >Ask Owner</button>
                        </> : <></>}
                    </div>


                    <div className="full-half" style={{display:'flex', justifyContent:'center', backgroundColor:'white', borderRadius:'0.5rem' }}  >
                            <div className="first-half"  style={{width:'50%' , fontSize:'15px' , fontWeight:'100'}} >

                                {ownerInfo.length > 0  ? <>

                    
                                    <h4>email : {ownerInfo.email}</h4>
                                    <h4>name : {ownerInfo.name}</h4>

                                </> : <>

                                    <div className="block" style={{display:'flex'}} >

                                        <div className="b1">
                                            <img src={propertyInfo.uploaderPhotoUrl} alt="" style={{height:'40px', width:'fit-content'}} />
                                        </div>

                                        <div className="b2" style={{display:'block'}} >
                                            <h4>Email : {propertyInfo.uploaderEmail}</h4>
                                            <h4>Name : {propertyInfo.uploaderName}</h4>
                                            <h4>User since : {propertyInfo.uploaderCreationTime}</h4>
                                        </div>
                            
                                    </div>

                                </> }

                            </div>

                            <div className={show ? "visible" : "invisible"} >
                                <form onSubmit={sendChat}>
                                    <textarea onChange={onChange}  ></textarea> <br />
                                    <button onClick={sendChat}  >{show ? <><FaPaperPlane /></> : <></>}</button>
                                </form>
                            </div> 
                    </div>
            </div> */}
        </div>
        )
    }
} 
export default Property 