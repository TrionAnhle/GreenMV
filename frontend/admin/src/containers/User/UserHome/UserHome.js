import Header from '../../Header/Header';
import Footer from '../../../components/Footer/Footer';
import Slideshow from '../../Slideshow/Slideshow';
import React, { useState,useEffect } from 'react';
import API from '../../utils/request';
import './UserHome.css'
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';
import Movie from '../../../components/Movie/Movie'

function UserHome() {
    const [movies, setMovies] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem('role') != null){
            if( localStorage.getItem('role') == 'ROLE_ADMIN'){
                history.push("/admin");
            }else if(localStorage.getItem('role') == 'ROLE_STAFF'){
                history.push("/session");
            }
        }
        API.get('/api/public/movie/is-showing')
            .then((res) =>{
                setMovies(res.data.data);
                console.log(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
    }, [])


    return (
        <div style={{backgroundColor:'black', color:'white'}}>
            <Header/>
            <Slideshow/>
            <h1 style={{textAlign : 'center'}}>Phim đang chiếu</h1>
            <div className="movie-container">
                {movies.map(movie =>(
                    <Movie key={movie.id} data={movie}/>
                ))}
            </div>
            <Footer/>
        </div>
    )
}

export default UserHome
