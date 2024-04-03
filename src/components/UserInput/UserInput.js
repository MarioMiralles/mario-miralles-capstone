import './UserInput.scss'
import logo from '../../assets/images/Logo2024.png'
const apiKey = process.env.REACT_APP_API_KEY;

function UserInput() {

    return (
        <main>
            <form className='form' onSubmit={handleSubmit}>
                <fieldset>
                    <legend><img src={logo} className='logo' alt="ON THE Dai AI Art Generator Logo" /></legend>
                    <textarea
                        className='form__input'
                        placeholder='What would you like to create?'
                        value={inputText}
                        onChange={(event) => setInputText(event.target.value)}>
                    </textarea>
                    <button type='submit' className='form__button'>GENERATE</button>
                </fieldset>
            </form>
        </main>
    )
}

export default UserInput;