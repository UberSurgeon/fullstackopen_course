 import { filterChange } from "../reducers/filterReducer";
 import { useDispatch } from "react-redux";

 const VisFilter = (props) => {
    const dispatch = useDispatch()


    return (
        <div>
            filter <input type='text' name='filter' onChange={(event) => dispatch(filterChange(event.target.value))} />
        </div>
    )

 }

 export default VisFilter
