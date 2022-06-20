import * as React from 'react';

export const SANForm = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
      }

    return( 
    <div>
        <form onSubmit={handleSubmit}>

            <input type="submit" />
        </form>
    </div>
    )
}