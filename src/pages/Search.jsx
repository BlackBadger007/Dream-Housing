import { useState } from "react"
import { collection, getDocs , query, where  } from "firebase/firestore"
import { db } from "../firebase.config"
import CategoryListing from "./CategoryListing"
import { FaSearch } from "react-icons/fa"


function Search(){

    const [data , setData] = useState([])
    const [text , setText] = useState('')
    
    const onChange = async (e) => {
        setText(e.target.value)
        console.log(text)
    } 

    const onCLick = async () => {

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


    }



    return(
        <div className="cont" >

             <div className="search11">
                
                <input type="text" placeholder="Search Place" onChange={onChange} /> 
                 <button onClick={onCLick} ><FaSearch /></button> 
                 
            </div>

        
            
        



        <div className="cate">
            <div className="card-container">

                <div className="bar">
                    <h1 style={{marginBottom:'15px'  }} >Results</h1>
                </div>

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
export default Search