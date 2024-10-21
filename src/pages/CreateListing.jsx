import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4} from 'uuid'
import { getAuth } from "firebase/auth"
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import Buffer from '../components/Buffer'
import { toast , ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
// import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

function CreateListing(){

    const auth = getAuth()

    const navigate = useNavigate()

    const [loading , setLoading] = useState(false)

    const [prg , setPrg] = useState('')


    const [formData , setFormData] = useState({
        type:'sell',
        name:'',
        bedrooms:'1',
        bathrooms:'1',
        parking:'false',
        furnished:'false',
        address:'',
        offer:'false',
        regularPrice:'',
        discountedPrice:'',
        images:[],
        latitude:0,
        longitude:0,
    })

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData

    const [ids, setIds] = useState('')

    const[typeV , setType]=useState(false)
    const [parkingV , setParking] = useState(false)
    const [furnishedV , setFurnished] = useState(false)
    const [offerV , setOffer] = useState(false)
    const [offerVisi , setOfferVisi] = useState(false)
    const [geoLocationOn , setGeoLocationOn] = useState(false)


    const getLocation = () => {

        if(navigator.geolocation){
          console.log(navigator.geolocation.getCurrentPosition(success , error));
        }else{
          console.log("geolocation not supp");
        }

        function success(position) {

          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          
          setFormData((prevState) => ({
            ...prevState,
            latitude:Number(lat),
            longitude:Number(long),
          }))
          console.log(`Latitude: ${lat}, Longitude: ${long}`);
        
          

        } 
      
        function error() {
          console.log("Unable to retrieve your location");
        }

        setGeoLocationOn(true)
    }

    useEffect(()=>console.log(formData),[formData])


    const onChange= (e) => {

        if(!e.target.files){
            if( e.target.id === 'type'){
                setType(!typeV)
            }
            if(e.target.id === 'parking'){
                setParking(!parkingV)
            }
            if(e.target.id === 'furnished'){
                setFurnished(!furnishedV)
            }
            if(e.target.id === 'offer'){
                setOffer(!offerV)
                setOfferVisi(!offerVisi)
            }
            if(e.target.id ==='latitude' || e.target.id === 'longitide'){
              
              setFormData((prevState) => ({
                  ...prevState,
                  [e.target.id] : Number(e.target.value)
              }))
            }
    
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id] : e.target.value
            }))
        }else{
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

    }

    const onSubmit= async (e) => {
        e.preventDefault()

        if(name.trim().length === 0 || 
        address.trim().length === 0 || 
        regularPrice.trim().length === 0 || 
        latitude === 0  ||
        longitude === 0  ||
        images.length ===0
        ){
          toast("Missing data")
          return;
        }
        if(offer === true && discountedPrice.trim().length === 0){
          toast("Missing data")
          return;

        }
        // setLoading


        

        const auth = getAuth()
        const bujo = auth.currentUser.uid
        console.log(bujo)

        setLoading(true)

        console.log(formData)

        // store images in firebase storage
        const storeImage = async (image) =>{
            return new Promise ((resolve , reject) =>{
                const storage=getStorage()
                const fileName=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage,'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
    setPrg(parseFloat(progress.toFixed(2)))
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
    }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL)
    });
  }
);
            })

        }

        let imgUrls  = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            console.log("not possible")
            return
        })



        const add=address.toLowerCase()
        // space and coma
        const word=address.split(/[\s,]+/)
        console.log(word)
        



        console.log(imgUrls)
        setPrg('')
        // noe we need this to add to firestore so instead of clg we do
        const formDataCopy = {
            ...formData,
            imgUrls,
            keywords : word,
           uploaderId: auth.currentUser.uid,
           uploaderName : auth.currentUser.displayName,
           uploaderEmail : auth.currentUser.email,
           uploaderPhotoUrl : auth.currentUser.photoURL,
           uploaderCreationTime : auth.currentUser.metadata.creationTime,
            // geolocation,
            timestamp: serverTimestamp(),
            
        }

        delete formDataCopy.images
        // delete formDataCopy.address //as we have used geolocation
                // etc...
                console.log(formDataCopy)


        const docRef = await addDoc(collection(db, 'listings'),formDataCopy)
        

    // etc function.....
    // navigate('/category/${formDataCopy.type}/${docRef.id')

    setLoading(false)
    navigate('/profile')

    // console.log(docRef)

    }


    if(loading){
      return (

        <>
        <Buffer/>
        <h2 style={{maxWidth: 'fit-content' , margin: 'auto' ,marginTop:'270px'}} >{prg}%</h2>
        
        </>
        
      ) 
    }else{

    
    

    return(
        <div className="container">
          <ToastContainer/>
            <h1>CreateList</h1><br />
            <button className="cng" onClick={() => navigate('/profile')} style={{position:'fixed' , top:'0px', right:'0px' ,marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>


        <form onSubmit={onSubmit}>

<h3>Sell/Rent</h3>
<div className="radio-inputs">      
  <label className="radio"> 
    <input type="radio" onChange={onChange} value='rent' checked={typeV} id="type" />
    <span className="name">Rent</span>
  </label>
  <label className="radio">
    <input type="radio" onChange={onChange} value='sell' checked={!typeV} id="type" />
    <span className="name">Sell</span>
  </label>
</div>



            <h3>Name</h3>
            <input type="text" onChange={onChange} id='name'/><br />




<div className="no-container">

            <div className="no-card">
            <h3>Bedrooms</h3>
            <input type="number" className="no" placeholder="1"  max='10' min='1' id="bedrooms" onChange={onChange} /><br />

            </div>

            <div className="no-card">
            <h3>Bathrooms</h3>
            <input type="number" className="no" placeholder="1"  max='10' min='1' id="bathrooms" onChange={onChange} /><br />


            </div>
    </div>
            
<h3>Parking spot</h3>
        <div className="radio-inputs">
  <label className="radio">
    <input type="radio" onChange={onChange} value={true} checked={parkingV} id="parking"/>
    <span className="name">Yes</span>
  </label>
  <label className="radio">
    <input type="radio" onChange={onChange}value={false} checked={!parkingV} id="parking"/>
    <span className="name">No</span>
  </label>
</div>

<h3>Furniture</h3>
        <div className="radio-inputs">
  <label className="radio">
    <input type="radio" onChange={onChange} value={true} checked={furnishedV} id="furnished"/>
    <span className="name">Yes</span>
  </label>
  <label className="radio">
    <input type="radio" onChange={onChange}value={false} checked={!furnishedV} id="furnished"/>
    <span className="name">No</span>
  </label>
</div>

<h3>Address</h3> 
            <input type="text" onChange={onChange} id='address' />
            <br />



  <div className="grant">
<div className="locate" >

<h4  >Location</h4>

            <button className="cng" onClick={getLocation} >Auto Detect</button>

            <h4 style={{fontWeight:'100'}} >( recommended )</h4>
  </div>
            

            {geoLocationOn ? <>    
            <div className="cords">
            {/* <h3>Latitude </h3> */}
            <label htmlFor="">Latitude </label>
            <input type="number" value={latitude} id='latitude' /><br />
            
            {/* <h3 style={{marginBottom:"10px"}} >Longitude : {longitude}</h3> */}
            <label htmlFor="">Longitude </label>
            <input type="number" value={longitude} id='longitude' /><br />
              
              </div>         
            </> : <></>}

            </div>


<h3>Offer</h3>
        <div className="radio-inputs">
  <label className="radio">
    <input type="radio" onChange={onChange} value={true} checked={offerV} id="offer"/>
    <span className="name">Yes</span>
  </label>
  <label className="radio">
    <input type="radio" onChange={onChange}value={false} checked={!offerV} id="offer"/>
    <span className="name">No</span>
  </label>
</div>

            {/* <h3>Address</h3>
            <input type="text" onChange={onChange} id='address' />
             */}



            

            <h3>Regular Price</h3>
            <input type="text" onChange={onChange} id='regularPrice' />{type==='rent' ? <label id="offerRP" style={{marginLeft:'10px', fontWeight:'700' }} >$/Month</label> : <></>}
            <br />

            <div className={offerVisi ? "navDiscountOffer" : " navInvi "}>

            {/* {offerVisi ? <> */}
            <h3 className={offerVisi ? "navDiscountOffer" : " navInvi "} >Discounted Price</h3>
            <input  type="text" onChange={onChange} id={offerVisi ? 'discountedPrice' : 'navInvi' }/>{type==='rent' ? <label id="offerRP" style={{marginLeft:'10px', fontWeight:'700' }} >$/Month</label> : <></>}
            {/* </> : <></> } */}

            </div>
            


            


            <h3>Images</h3>
            <input type='file' id='images' onChange={onChange} accept='.jpg,.png,.jpeg' multiple required />
            <br />
            <button type="submit" className="btn-create-list">Create Listing</button>

        </form>
        </div>
    )
  }
}
export default CreateListing