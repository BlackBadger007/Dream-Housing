import { FaBath , FaBed , FaGift} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function CategoryListing({piece}){

    const navigate = useNavigate()

    const onClick = () => {
        navigate(`/property/${piece.productId}`)
    }

    return(
        <div className="card" id={piece.productId} >
            <div className="subcard">
                <img src={piece.info.imgUrls[0]} alt="" className="card-img"/>

            </div>
            <div className="subcard">

                <div className="subcard1">
                    <h3>{piece.info.address}</h3>
                    <h2>{piece.info.name}</h2>

                    <div className="subcard2">

                        <div className="subcard4">
                            {/* <h2>{piece.info.parking} | {piece.info.furnished} | {piece.info.offer} | {piece.info.regularPrice}</h2> */}
                            {/* <h2> {piece.info.furnished} | </h2> */}
                            {/* <h2>{piece.info.offer} | </h2> */}
                            <h2 style={{color:"rgb(32, 180, 106)"}} >{piece.info.regularPrice} {piece.info.type === 'rent' ? <>$/Month</> : <>$</>}  {piece.info.offer === 'true' ? <FaGift/> : <></> }  </h2>
                        </div> 

                        <div className="subcard3">
                            <h2 id="bed" ><FaBed style={{marginRight:'5px'}} />{piece.info.bedrooms}</h2>
                            <h2 id="bath"  ><FaBath style={{marginRight:'5px'}} />{piece.info.bathrooms}</h2>
                            {/* <h2><FaBed/> {piece.info.bedrooms} <FaBath/> {piece.info.bathrooms}</h2> */}
                        </div>

                        <div className="subcard5">
                            <button className="expll" onClick={onClick} >Visit</button>
                        </div>

                    </div>
                </div>

                
            </div>
        </div>    
    )
}
export default CategoryListing