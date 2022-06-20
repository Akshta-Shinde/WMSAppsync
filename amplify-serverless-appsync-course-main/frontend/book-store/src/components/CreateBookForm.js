import * as React from 'react';


export const CreateBookForm = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`The name you entered was:`);
      }

    return( 
    <div>
        <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
        </form>
    </div>
    )
}