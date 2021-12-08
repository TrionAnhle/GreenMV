import Header from '../../Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useParams } from "react-router-dom";
import './UserMovieDetail.css';
import { useState,useEffect,useRef } from 'react';
import API from '../../utils/request';
import { APPCONFIG } from '../../utils/constants';
import { Button } from 'primereact/button';
import ReactPlayer from "react-player"
import { Dialog } from 'primereact/dialog';
import { useHistory } from "react-router-dom";


function UserMovieDetail() {
    const params = useParams();
    const [data, setData] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        API.get('/api/public/movie/'+params.id)
            .then((res) =>{
              if(res.data.data == null){
                  setData({});
              }else{
                  if(res.data.ok){
                      setData(res.data.data[0]);
                  }else setData({});
              }
            })
            .catch((error)=>{
                console.log(error);
        });
    }, [params.id])


    const buyTicket = () =>{
        history.push("/movie/session");
    }

    return (
        <div className="body-container">
            <Header/>
            {   Object.keys(data).length == 0 ?
                <h1 style={{textAlign:'center'}}>Không tìm thấy phim</h1> :
                (
                    <div className="p-grid" style={{justifyContent: 'center'}}>
                        {/* <div className="p-col-12"> */}
                            <div className="p-col-3" style={{width:'250px'}}>
                                <div className="p-grid">
                                    <img src={APPCONFIG.BASE_URL_IMAGE+data.pathThumbnail} 
                                        style={{objectFit: 'cover',
                                            maxWidth: '100%',
                                            imageRendering: 'auto',
                                            imageRendering: 'crisp-edges',
                                            imageRendering: 'pixelated'}}/>
                                </div>
                                <div className="p-grid p-mt-5">
                                    <Button label="Trailer" className="p-button-info" onClick={() => setDisplayModal(true)} disabled={data.pathVideo=='' ? 'disabled' : ''}/>
                                    <Button label="Mua vé" className="p-button-info" style={{marginRight : 0, marginLeft: 'auto'}} onClick={buyTicket}/>
                                    { data.pathVideo == ''

                                    }
                                    <Dialog header={'Trailer'} onHide={() => setDisplayModal(false)} visible={displayModal} 
                                        breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{justifyContent: 'center',}}>
                                        <ReactPlayer
                                            url={data.pathVideo}
                                        />
                                    </Dialog>
                                    
                                </div>
                            </div>
                            <div className="p-col-8 p-ml-5">
                                <div className="p-grid p-mt-2">
                                    <h1>{data.name}</h1> 
                                    {data.isShowing ? 
                                        <Button icon="pi pi-bell" label="Đang công chiếu" className="p-button-rounded p-button-warning p-button-outlined p-ml-2" /> : ''
                                    }
                                </div>
                                <div className="p-grid p-mt-2">
                                    <h3>Thể loại: {data.category[0].name}</h3>
                                </div>
                                <div className="p-grid p-mt-2">
                                    <h3>Thời lượng: {data.screenTime} phút</h3>
                                </div>
                                <div className="p-grid p-mt-2">
                                    <p>{data.description}</p>
                                </div>
                                 
                            </div>
                        {/* </div> */}
                    </div>
                )
            }
                
            
            <Footer/>
        </div>
    )
}

export default UserMovieDetail
