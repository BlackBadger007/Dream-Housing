import CenteredCarousel from '../components/Swiper/CenteredCarousel'
import ImgSale from './img/istockphoto-1150545984-1024x1024.jpg'
import ImgRent from './img/istockphoto-1221865611-1024x1024.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Search from './Search'
import { useState } from "react"
import { collection, getDocs , query, where , or } from "firebase/firestore"
import { db } from "../firebase.config"
import CategoryListing from "./CategoryListing"
import { FaSearch } from "react-icons/fa"
import { FaCompass , FaGift , FaUser } from "react-icons/fa"


function  Explore(){

    const [data , setData] = useState('')
    const [text , setText] = useState('')

    const navigate = useNavigate()
    
    const onChange = async (e) => {
        setText(e.target.value)
        console.log(text)
    } 

    const onCLick = async (e) => {
        e.preventDefault()

        let data = []

        const q = query(collection(db, "listings"), where("keywords", "array-contains", text.toLowerCase()));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        data.push({
            productId : doc.id,
            info : doc.data(),
        })
        });

        setData(data)
        console.log(data);


    }



    return (
        <div className="abc">

        
        <div className="explore">
            <div className='header' style={{display:'flex'}} >


            <h1  >Explore</h1>


            <div className="search11">
                <form onSubmit={onCLick}>
                <input type="text" placeholder="Search Place" onChange={onChange} /> 
                 <button type='submit' onClick={onCLick}  ><FaSearch /></button> 

                </form>
            </div>

            {/* <footer>
                <ul>
                    <li onClick={() => navigate('/') } >
                        <h3 ><FaCompass /></h3>
                        <h3 >Explore</h3>
                    </li>
                    <li onClick={() => navigate('/offer') } >
                        <h3><FaGift/></h3>
                        <h3>Offer</h3>
                    </li>
                    <li onClick={() => navigate('/profile') } >
                        <h3><FaUser/></h3>
                        <h3>Profile</h3>
                    </li>        
                </ul>
            </footer> */}


            {/* <ul className='expp' >
                
                <li className='exp'>
                <Link to="category/sell" className='sell-rent'  >
                    <h2 style={{marginTop:'0px'}} className='h-sell-rent' >Buy</h2>   
                </Link>
                </li>
                <li className='exp' >
                <Link to="category/rent" className='sell-rent' >
                    <h2 style={{marginTop:'0px'}} className='h-sell-rent' >Rent</h2>
                </Link>
                </li> */}

{/* ///////////////////////////////////////////////////////// */}


                

                {/* <li className='exp' >
                <Link to="/offer" className='sell-rent' >
                    <h2 style={{marginTop:'0px'}} className='h-sell-rent' >Offer</h2>
                </Link>
                </li>
                <li className='exp'   >
                <Link to="/profile" className='sell-rent'  >
                    <h2 style={{marginTop:'0px' , backgroundColor:'white', color:'rgb(32, 180, 106)', fontSize:'27px'  , width:'50px' }} className='h-sell-rent' ><FaUser/></h2>
                </Link>
                </li> */}

{/* ///////////////////////////////////////////////////////    */}
            {/* </ul> */}


                <div className="listi">
                    <Link to="/category/sell" className="lis-l" >Buy</Link>
                    <Link to="/category/rent" className="lis-l">Rent</Link>
                    <Link to="/offer" className="lis-l">Offers</Link>
                    {/* <Link to="/createListing" className="lis-l">Sell</Link> */}
                    <Link to="/profile" className="lis-l"><FaUser/></Link>
                </div>




            </div>


            <div className="swip">
            <CenteredCarousel/>

            </div>

        {data === '' ? <div className="intro">
                    <h1>Let's get started !</h1>
                    <h2>Welcome to Dream Housing</h2>
                </div> :
        data.length > 0 ? <>
            <div className="cate">
            <div className="card-container">

                <div className="bar">
                    <h1 style={{marginBottom:'15px'}} >Results</h1>
                </div>

                {
                    data.map((item) => (
                        <CategoryListing piece={item} key={item.productId} />
                    ))
                }
                    </div>
                </div>
                </> : <>
                <div className="intro">
                    {/* <h1>Let's get started !</h1> */}
                    <h1></h1>
                    <h2>Nothing found !</h2>
                </div>
                </>}
        </div>
        </div>
    )

}
export default Explore