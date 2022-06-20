import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { getBookById } from "./graphql/queries/book";
import { onCreateBook } from "./graphql/subscriptions/book";
import { createBook } from "./graphql/mutations/mutations";
import './App.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { CreateBookForm } from './components/CreateBookForm';
// toast.configure();

function App() {

  const [book, setBook] = useState(null);

  useEffect(() =>{
    const subscription = API.graphql(graphqlOperation(onCreateBook)).subscribe({
      next: (result) => {
        console.log(result);
        toast("New book added");
        const newBook = result.value.data.onCreateBook;
        setBook(newBook);
      }
    })
  }, [])
  // useEffect(() =>{
  //   const subscription = API.graphql(graphqlOperation(onCreateItemMaster)).subscribe({
  //     next: (result) => {
  //       console.log(result);
  //       // toast("New book added");
  //       const newItemMaster = result.value.data.onCreateItemMaster;
  //       setBook(newItemMaster);
  //     }
  //   })
  // }, [])

  const getBook = async () => {
    // make a call to appsync api
    // const book = await API.graphql(graphqlOperation(getBookById, { id: "97d97d2d-87b6-4e81-97da-8a63a1f8ae9f" }));

    const book = await API.graphql({
      query: getBookById,
      variables: { id: "79e12dd8-2dbe-420d-b836-88e6f68d6568" },
      authMode: 'AMAZON_COGNITO_USER_POOLS'    // 'AWS_IAM'
    });

    setBook(book.data.getBookById);
  }

  const viewBook = () => {
    if (book) {
      return (<article>
        <h3>{book.title}</h3>
        <p>{book.description}</p>
        <p>{book.author}</p>
        <p>{book.price}</p>
      </article>)
    }
  }

  const addBook = async () =>{
    console.log("In add book");
    var objA = {
      title: 'This is title150',
      description: 'This is description150',
      author: 'This is author50',
      price: 999.89
    };

    const newBook = await API.graphql({
      query: createBook,
      variables: { input: objA },
    });

    console.log(newBook);
    setBook(newBook.data.getBookById);

  }

  return (
    <div>
      <AmplifySignOut />
      <section className="book-section">
        {/* <button onClick={() => getBook()}>Get book details</button>
        <hr />
        {viewBook()}
        <ToastContainer /> */}
        <button onClick={() => addBook()}>Add Book</button>
        {viewBook()}
        <ToastContainer />
        {/* <CreateBookForm /> */}
      </section>
    </div>
  );
}

export default withAuthenticator(App);
