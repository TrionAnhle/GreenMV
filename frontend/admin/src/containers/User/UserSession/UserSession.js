import Header from '../../Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Button } from 'primereact/button';
import { useState,useEffect,useRef } from 'react';
import API from '../../utils/request';
import { toTimeString } from '../../utils/date'
import { useHistory } from "react-router-dom";


function UserSession() {
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const [sessions, setSessions] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem('token')==null)
            history.push("/login");
        API.post('/api/user/customer/username', {username:localStorage.getItem('username')}, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
        .catch((error)=>{
            if(error.response.status === 401){
                history.push("/login");
            }
        });

        let lstDate = [];
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);
            let d = {
                id : i,
                value: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                label: getDayOfWeek(date) +' '+date.getDate()+'/'+(date.getMonth()+1)
            };
            lstDate.push(d);
        }
        setData(lstDate);    
    }, []);

    useEffect(() => {
        let date = new Date();
        let time = '';
        if(data.length == 0){
            time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        }else{
            if(index == 0) time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            else time = '';
        }

        let body = {
            date : (data.length == 0 ? (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()) : data[index].value),
            time : time
        }

        API.post('/api/public/session/inday', body)
            .then((res) =>{
              if(res.data.data.length > 0){
                let arr = res.data.data;
                setSessions(convertData(arr));
              }else{
                setSessions([]);    
              }
            })
            .catch((error)=>{
                console.log(error);
        });
    }, [index]);

    const convertData = (arr) =>{
        let lst = [];
        for(let i = 0; i<arr.length; i++){
            let movie = {};
            movie["id"] = arr[i].movie.id
            movie["name"] = arr[i].movie.name;
            movie["pathThumbnail"] = arr[i].movie.pathThumbnail;
            let lstSession = []
            let s = {}
            s["id"] = arr[i].id;
            s["time"] = toTimeString(arr[i].showTime);
            lstSession.push(s);
            if( i+1 < arr.length){
                while(arr[i].movie.id == arr[i+1].movie.id){
                    let session = {}
                    session["id"] = arr[i+1].id;
                    session["time"] = toTimeString(arr[i+1].showTime);
                    lstSession.push(session);
                    i++;
                }
            }
            movie["session"] = lstSession;
            lst.push(movie);
        }

        return lst;
    }

    const getDayOfWeek = (day) =>{
        return (day.getDay() === 0 ? 'Chủ nhật' : 'Thứ '+(day.getDay()+1));
    }

    const showLstButton = () => {
        return (
            <div>
                {data.map((ele, i) => {
                    return (<Button label={ele.label} key={i} 
                    className={'p-button-rounded p-button-success p-mr-5 p-mb-2 '+(index == ele.id ? '' : 'p-button-outlined')}  
                    onClick={() => setIndex(ele.id)}/>);
                })}
            </div>
        );
    }

    const redirectSessionDetail = (ele) => {
        history.push("/movie/session/"+ele.id);
    }

    const renderListItem = (lst) =>{
        return(
            <div>
                {lst.map((ele, index)=>{
                    return <Button label={ele.time} key={index} 
                    className="p-button-rounded p-button-info p-mr-2" 
                    onClick={() => redirectSessionDetail(ele)}/>
                })}
            </div>
        );
    }

    const showListSession = () => {
        return (
            <div>
                {sessions.length == 0 ?
                <div className="p-grid p-col-12" style={{justifyContent: 'center'}}><h3>Không có suất chiếu nào</h3></div> :
                sessions.map((ele, index)=>{
                    return(
                        <div className="p-grid p-col-12 p-mb-3" key={index}>
                            <div className="p-col-12 p-md-3 p-sm-12"></div>
                            <div className="p-col-12 p-md-3 p-sm-12"><h3>{ele.name}</h3></div>
                            <div className="p-col-12 p-md-6 p-sm-12">{renderListItem(ele.session)}</div>
                        </div>
                    );
                })}
            </div>
        );
    }


    return (
        <div className="body-container">
            <Header/>          
            <div className="p-grid" style={{justifyContent: 'center'}}>
                {showLstButton()}
            </div>
            
                {showListSession()}
            
            <Footer/>
        </div>
    )
}

export default UserSession
