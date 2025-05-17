import { useEffect} from "react";
import { useSelector , useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getPost } from "../../Store/postSlice";

 const usePostDetails = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const {record , loading , error} = useSelector((state) => state.posts)

    useEffect(() =>{
        dispatch(getPost(id))
    },[dispatch,id])

return {record , loading,error}
}
export default usePostDetails