import {createFileRoute} from "@tanstack/react-router";
import axios from 'axios';

export const Route = createFileRoute('/')({
    component: App,
});

function App() {

      const token = localStorage.getItem('token');
axios.get('http://localhost:3000/api/protected', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    return(
        <>
            <h1>TEST</h1>
            <h1> LOL = {token}</h1>
        </>
    );
}
