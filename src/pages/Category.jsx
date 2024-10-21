import {collection , query, where, getDocs , doc , orderBy , limit , startAfter } from 'firebase/firestore'
import { db } from "../firebase.config"
import { useNavigate, useParams } from "react-router-dom"
import { useState , useEffect } from "react"
import CategoryListing from './CategoryListing'
import Buffer from '../components/Buffer'
import { FaArrowLeft } from 'react-icons/fa'


function Category  (){

    const params=useParams()
    const [loading , setLoading] = useState(true)
    const [data,setData] =useState(null)

    const navigate= useNavigate()

    useEffect(() => {

        const fetchList = async () => {

            let listing = []

            // const querySnapshot = await getDocs(collection(db, "listings"))
            // querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data())
                // listing.push({
                    //     productId : doc.id,
                    //     info :doc.data()
                    // })

            const q = query(collection(db, 'listings') , 
                        where('type' , '==' , (params.login)))

            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                    // console.log(doc.id, "==>" , doc.data())
                    listing.push({
                        productId : doc.id,
                        info : doc.data(),
                    })
            })
            
        setData(listing)
        setLoading(false)
    }

    fetchList() 

    },[])

    // useEffect(() => {console.log(data)},[data])

    return(
        <div className="cate">
            {/* <h1 style={{marginBottom:'15px'}} >Places for {params.login}</h1> */}
            {/* {loading ? <>loading...</> : <> */}
            {loading ? <Buffer/> : <>
            {data !== null ? <>
            <div className="card-container">

                <div className="bar">
            <h1 style={{marginBottom:'15px'}} >Places for {params.login}</h1>
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
export default Category