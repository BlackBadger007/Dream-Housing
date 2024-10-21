import { FaCompass , FaGift , FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

function Navbar(){

    const navigate=useNavigate()

    return(
            <footer>
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
            </footer>
    )
}
export default Navbar