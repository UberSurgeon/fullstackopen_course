import { useDispatch } from "react-redux";
import { createAnec } from "../reducers/anecdoteReducer";


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnec = async (event) => {
        event.preventDefault()
        const content = event.target.anec.value
        event.target.anec.value = ''
        dispatch(createAnec(content))
    }

    return (
        <>     
            <h2>create new</h2>
            <form onSubmit={addAnec}>
                <input name='anec'/>
                <button type='submit'>add</button>
            </form>
        </>
    )
}

export default AnecdoteForm
