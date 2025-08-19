import axios from "axios";
import { error } from "console"

export default  async function login( req, res){
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
      }
      try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/endpoint`, "")
            res.status(200).json({message: "Authenticated Successfully"})
     console.log("apiResponse", response)
      }catch(error){
        console.log(error)
      }
}