import { collection, query, where, getDocs } from "firebase/firestore";
import {useState , useEffect} from 'react'
import Buffer from "../components/Buffer";
import { db } from "../firebase.config";
import CategoryListing from "./CategoryListing";
import {useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";

function Offer(){

    const [data , setData] = useState(null)
    const [loading , setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {

        const fetchList = async () => {

            let listing = []

            const q = query(collection(db, "listings"), where('offer', '==', 'true'));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                listing.push({
                    productId: doc.id,
                    info : doc.data(),
                })
            });

            setData(listing)
            setLoading(false)

        }


        fetchList()
        
    },[])

    return(
        <div className="cate">

            {loading ? <Buffer/> : <>
            {data !== null ? <>
            <div className="card-container">

                <div className="bar">
            <h1 style={{marginBottom:'15px'}} >Places with offer</h1>
            {/* <button className='back' onClick={()=>navigate('/')} >Back</button> */}
            <button className="cng" onClick={() => navigate('/')} style={{marginTop:'20px' , fontSize:'27px' , fontWeight:'600' ,marginTop:'25px', background:'none' , color:'rgb(32, 180, 106)'}} ><FaArrowLeft/></button>


                </div>

                {
                    data.map((item) => (
                        <CategoryListing piece={item} key={item.productId} />
                    ))
                }
            </div>
            
            </> : <><h4>no data found yet</h4></>}</>}
        </div>
    )


}
export default Offer