import { APPCONFIG } from '../../containers/utils/constants';
import { Button } from 'primereact/button';
import './Movie.css'
import { Link } from 'react-router-dom';

const Movie  = (props) => {
    return (
        <div className="movie">
            <Link to={'/movie/detail/'+props.data.id}>
                <img src={APPCONFIG.BASE_URL_IMAGE+props.data.pathThumbnail}/>
            </Link>
            <div className="movie-info">
                <h3>{props.data.name}</h3>
            </div>
        </div>
    )
}

export default Movie
