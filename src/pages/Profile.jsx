import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth , updateProfile , verifyBeforeUpdateEmail ,reauthenticateWithCredential } from "firebase/auth"
import { collection, query, where, getDocs , doc , getDoc ,  updateDoc } from "firebase/firestore";
import { getStorage, ref , uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { EmailAuthProvider } from "firebase/auth/web-extension";
import { v4 as uuidv4} from 'uuid'
import { db } from "../firebase.config";
import { ToastContainer , toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css' 
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import Buffer from "../components/Buffer";
import CategoryListing from "./CategoryListing"
import Google from "./Google";
import { FaBell , FaArrowLeft } from "react-icons/fa6";


function Profile () {

  const navigate = useNavigate()
  const auth = getAuth()
//   console.log(auth.currentUser)

  // store
  const [data , setData] = useState(null)
  const [pass , setPass ] = useState(null)
  // const [user , setUser] = useState(null)
  const [fetch , setFetch] = useState({
    name : auth.currentUser.displayName,
    // email :auth.currentUser.email,
    // phoneNumber:auth.currentUser.phoneNumber,
    images : [],
    
  })

  const {
    name,
    // email,
    images,
    // phoneNumber,
  } = fetch
  

  //state
  const [loading , setLoading] = useState(true)
  const [prg , setPrg] = useState(null)
  
  // css   
  const [darker , setDarker] = useState(false)
  const [inputVisi , setInputVisi] = useState(false)

  useEffect(() => {

    const fetchData = async () => {

            let listing = []

            const q = query(collection(db, "listings"), where("uploaderId", "==", auth.currentUser.uid));
    
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                listing.push({
                    productId : doc.id,
                    info : doc.data(),
                })
            })
            setData(listing)

            // const docRef = doc(db, "users", auth.currentUser.uid);
            // const docSnap = await getDoc(docRef);
    
            // if (docSnap.exists()) {
            //     // console.log("Document data:", docSnap.data());

            //     setUser((prevState) => ({
            //       ...prevState,
            //       src: docSnap.data()
            //     }))
                
                
            // } else {
            //     console.log("No such document!");
            // }
      
            setLoading(false)
        }

        fetchData()
        
  },[])


  // useEffect(() => {console.log(data)},[data])
  // useEffect(() => {console.log(user)},[user])

  // EVENTS
    const onClick = () => {
        auth.signOut()
        navigate('/sign-in')
    }

    const onChange1 = (e) => {

        if(e.target.files){
            setFetch((prevState) => ({
                ...prevState,
                [e.target.id] : e.target.files[0]
            }))
        }else{
            setFetch((prevState) => ({
                ...prevState,
                [e.target.id] : e.target.value
            }))
        }
 
    }

    const update1 = async () => {

        

        // UPLOAD NEW PROFILE
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
                            default :
                        }
                    }, 
                    (error) => {
                        reject(error)
                    }, () => {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                            
                        });
                    }
                );
            })
        }
        
        // SETTING NEW PROFILE URL
        // let photoUrl = auth.currentUser.photoURL

        if(images.length>0){
           let photoUrl = await storeImage(images)
            setPrg(null)
            
            setLoading(true)
            
            // console.log(photoUrl)
            
            // UPDATE PROFILE NAME AND PROFILE PICTURE
            await updateProfile(auth.currentUser , {
                displayName : name,
                photoURL : photoUrl,
            } )
            
            // UPDATE EMAIL
            // try{
                //     await verifyBeforeUpdateEmail(auth.currentUser, email )
                
                // }catch(error){
                    //     toast("Recent sign-in is required to change the mail")
                    // }
                    
                    // UPDATE USERS IN FIRESTORE
                    const docRef = doc(db , 'users' , auth.currentUser.uid )
                    await updateDoc(docRef , {
                        name : name,
                        // email : email,
                        // we can add more data like phone no. etc
                    })
                }else{
                    setLoading(true)
            
            // console.log(photoUrl)
            
            // UPDATE PROFILE NAME AND PROFILE PICTURE
            await updateProfile(auth.currentUser , {
                displayName : name,
                // photoURL : photoUrl,
            } )
            
            // UPDATE EMAIL
            // try{
                //     await verifyBeforeUpdateEmail(auth.currentUser, email )
                
                // }catch(error){
                    //     toast("Recent sign-in is required to change the mail")
                    // }
                    
                    // UPDATE USERS IN FIRESTORE
                    const docRef = doc(db , 'users' , auth.currentUser.uid )
                    await updateDoc(docRef , {
                        name : name,
                        // email : email,
                        // we can add more data like phone no. etc
                    })
                }
                    
        setInputVisi(false)
        setDarker(false)

        setLoading(false)
        
    }

    const setPassValue = (e) => {
        setPass(e.target.value)
    }

    const authenticateUser =  () => {

        toast('verifying user' )
        const credential =  EmailAuthProvider.credential(auth.currentUser.email , pass);
        console.log(credential);
        reauthenticateWithCredential( auth.currentUser , credential).then(() => {
          // User re-authenticated.
          console.log("re-authenticated");
          
          toast.dismiss()
          toast('successfully verified')
          change()
        }).catch((error) => {
            toast("Wrong password bitch")
            console.log(error);
        });
    }

    const change = () => {
        setDarker(true)
        setInputVisi(true)
    }


    if(loading){
        return  <Buffer/> 
    }else{
        return(

            <div className="prof-cont">
                <div className="top-bar" >
                    <h1  >My profile</h1>
                    <div className="bbnl" style={{display:'flex'}}>
                    <button className="uploading" onClick={() => navigate('/createListing')} >Sell or rent your property</button>
                    <button className="cng" onClick={() => navigate('/')} style={{marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>

                    </div>

                </div>

                <div className="profile">
                    <ToastContainer/>
                    <div className="uper">
                        <h3 style={{fontSize:'20px' }}  >Personal details</h3>
                        {!inputVisi ? <>

                            <button className="cng" style={{marginTop:'5px'}} onClick={change} >Edit</button>
                            {/* <Popup trigger={<button className="cng" style={{marginTop:'5px'}} >Edit</button>} modal >
                                <h3 style={{marginBottom:'15px', marginTop:'5px', fontSize:'19px' ,fontWeight:'700', textAlign:'center' }}  >Verify yourself</h3>
                                <div className="tokas" style={{display:'flex'}} > 
                                    <input type="password" onChange={setPassValue} placeholder="ENTER  PASSWORD" /> 
                                    <button onClick={authenticateUser} className="cng" >Go</button>
                                    <p>OR</p>
                                    <Google/>
                                </div>
                            </Popup> */}

                        </> : <>

                            <button onClick={update1} className="cng" style={{marginTop:'5px'}} >Update</button>                            

                         </>}
                    </div>

                            {prg !==null ? <>
                            
                                <h2>{prg}%</h2>
                            
                            </> : <>
                            
                                <div className="personal-details" style={{display:'flex'}} >

                                    <div className={auth.currentUser.photoURL !== null ? "profile-pic" : "profile-pic-absent"}  >

                                        {!inputVisi ? <>

                                                    {auth.currentUser.photoURL !== null ? <>
                                                    <div className="abc" style={{width:'fit-content' , margin:'auto'}} >
                                                    <img src={auth.currentUser.photoURL} alt="" />
                                                    </div>
                            
                                        </> : <>
                            
                                            {/* <input type="file" style={{backgroundColor:'#EEE'}} id="images" onChange={onChange1} accept='.jpg,.png,.jpeg' required  /> */}
                                            <h4 style={{textAlign:'center'}} >Upload Pofile Pic</h4>
                            
                                        </> }

                            </> : <>
                            
                            <input type="file" style={{backgroundColor:'#EEE'}} id="images" onChange={onChange1} accept='.jpg,.png,.jpeg' required  />

                            
                            </>}

                        </div>

                        <div className= {!darker ? "profile-info" : "profile-info-active"} >
                        {!inputVisi ? <>  
                                    
                                        <h4 style={{marginBottom:'0px'}} >{auth.currentUser.displayName}</h4>
                                        <p style={{marginTop:'8px'}} > 
                                            Email : {auth.currentUser.email} <br /> 
                                            {/* Phone no : {auth.currentUser.phoneNumber}<br />  */}
                                            Last Logged : {auth.currentUser.metadata.lastSignInTime} <br /> 
                                            Together Since : {auth.currentUser.metadata.creationTime} <br /> 
                                            Listed Item : {data.length} <br /> 
                                            Favourites : none<br /> 
                                            
                                        </p>
                         
                                    </> : <>  

                                        <h4 style={{marginBottom:'0px'}} ><input type="text" value={name} onChange={onChange1} id='name' /></h4>
                                        <p style={{marginTop:'8px'}} > 
                                            {/* Email : <input type="text" value={email} onChange={onChange1} id='email' /> <br />  */}
                                            {/* Phone no : <input type="text" value={phoneNumber} onChange={onChange1} id='phoneNumber' /><br />  */}
                                            Email : {auth.currentUser.email} <br /> 
                                            {/* Phone no : <br />  */}
                                            Last Logged : {auth.currentUser.metadata.lastSignInTime} <br /> 
                                            Together Since : {auth.currentUser.metadata.creationTime} <br /> 
                                            Listed Item : {data.length} <br /> 
                                            Favourites : none<br /> 
                                            
                                        </p>

                                    </> }

                            <button onClick={onClick} className="cng" id="sout" >SignOut</button>
                        
                        </div>
                    </div>

                    </> }

                            <div className="panel" style={{display:'flex' , justifyContent:'space-between'}} >
                    <h3 style={{fontSize:'20px', marginBottom:'10px' }} id="yoy" >Your Listing ({data.length})</h3>
                    <button style={{color:'rgb(32, 180, 106'}}  onClick={()=> navigate(`/message/${auth.currentUser.uid}`)} >Notifications (<FaBell/>)</button>

                            </div>
                    <div className="upload-container" >                                        
                            {
                                data.map((item) => (                 
                                    <CategoryListing piece={item} key={item.productId} />
                                ))
                            }
                    </div>

                </div>
            </div>
        )
         
    }

}
export default Profile