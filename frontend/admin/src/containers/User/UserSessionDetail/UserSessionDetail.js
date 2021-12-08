import Header from '../../Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useState,useEffect,useRef } from 'react';
import API from '../../utils/request';
import { useParams } from "react-router-dom";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import { toDateTString } from "../../utils/date";
import './UserSessionDetail.css';
import Seat from '../../../components/Seat/Seat'
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import {Checkbox} from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { numberFormat } from "../../utils/number";

function UserSessionDetail() {
    const toast = useRef(null);
    const history = useHistory();
    const { promiseInProgress } = usePromiseTracker();
    const params = useParams();
    const [data, setData] = useState({});
    const [dataUser, setDataUser] = useState({});
    const [selectedSeat, setSelectedSeat] = useState([]);
    const [row, setRow] = useState([]);
    const colum = [1,2,3,4,5,6,7,8,9,10];
    const [typePayment, setTypePayment] = useState(true);
    const [isShowing, setIsShowing] = useState(true);
    

    useEffect(() => {
        setSelectedSeat([]);
        trackPromise(API.get('/api/public/session/'+params.id))
        .then((res) =>{
            if(res.data.ok){
                setData(res.data.data[0]);    
                let r = [];
                for(let i = 1; i<=res.data.data[0].cinema.numberSeats/10;i++)
                    r.push(i);
                setRow(r);
                let showTime = new Date(res.data.data[0].showTime);
                if(showTime >= new Date()){
                    setIsShowing(true);
                }else{
                    setIsShowing(false);
                }
            }else{
                setIsShowing(false);
            }
            
        })

        API.post('/api/user/customer/username', {username:localStorage.getItem('username')}, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
        .then((res) =>{
            setDataUser(res.data.data[0]);
        })
        .catch((error)=>{
            if(error.response.status === 401){
                history.push("/login");
            }
        });
             
    }, [params.id])

    const onAddSeat = (id) =>{
        const seats = [...selectedSeat];
        seats.push(id);
        setSelectedSeat(seats);
    }

    const onRemoveSeat = (id) =>{
        const seats = [...selectedSeat];
        seats.splice(seats.indexOf(id), 1);
        setSelectedSeat(seats);
    }

    const renderSeatItem = (row) =>{
        return(<>
            {colum.map((ele,index)=>{
                return <Seat labelIndex={(row-1)*10+ele} key={index} onAddSeat={onAddSeat} onRemoveSeat={onRemoveSeat} status={data.lstTicket.indexOf((row-1)*10+ele) == -1 ? 0 : 2}/>
            })}
        </>);
    }

    const renderSeat = () =>{
        return(
            <>
                {row.map((ele, index)=>{
                    return(
                        <div className='p-grid p-col-12 p-mt-2' style={{justifyContent:'center'}} key={index}>
                            <h2 className="p-mr-2">{ele}</h2>
                            {renderSeatItem(ele)}
                        </div>
                    );
                })}
            </>
        );
    }
    const renderNameSeat = () =>{
        return(<>
            {selectedSeat.map((ele,index)=>{
                return (index > 0 ? ',':'')+ele;
            })}
        </>);
    }

    

   
    const  onBookTickets = () =>{
        if(selectedSeat.length < 1)
        {
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn ghế', life: 3000});
            return;
        }    
        let body = {
            paymentType : typePayment ? 0 : 1,
            customerId: dataUser.id,
            sessionId: data.id,
            tickets : selectedSeat
        }

        API.post('/api/user/receipt', body, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                if(res.data.ok){
                    toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                    setTimeout(() => { history.push("/user/account/receipt"); }, 3000);
                    
                }else{
                    toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }
            })
            .catch((error)=>{
                console.log(error);
                toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
        });
    }

    return (<>
        <div className="body-container">
            <Header/>   
            {
                promiseInProgress ? <h2>Loading</h2> : 
                (
                    isShowing ?
                    (
                    <><Toast ref={toast} />
                    <div className="p-grid">
                        <div className ="p-col-12 p-sm-7">
                            <div className="p-grid p-col-12" style={{justifyContent:'center'}}>
                                <div class="block">
                                    <hr />
                                        <div class="text">Màn hình</div>
                                    <hr />
                                </div>
                            </div>
                            <div className="p-grid p-col-12" style={{justifyContent:'center'}}>
                                {renderSeat()}
                            </div>
                        </div>
                        <div className="p-col-12 p-sm-5" style={{backgroundColor:'white', color:'black'}}>
                            <div className="p-grid" style={{justifyContent:'center'}}><h2>Thông tin hoá đơn</h2></div>
                            <div className="p-grid p-col-12">
                                <div className="p-col-6">
                                    Họ Tên: {dataUser?.fullName}
                                </div>
                                <div className="p-col-6">
                                    Số điện thoại: {dataUser?.phone}
                                </div>
                            </div>
                            <div className="p-grid p-col-12">
                                <div className="p-col-6">
                                    Tên phim: {data?.movie?.name}
                                </div>
                                <div className="p-col-6">
                                    Ngày giờ: {toDateTString(data?.showTime)}
                                </div>
                            </div>
                            <div className="p-grid p-col-12">
                                <div className="p-col-6">
                                    Rạp số: {data?.cinema?.name}
                                </div>
                                <div className="p-col-6">
                                    Loại rạp: {data?.cinema?.type} - {data?.cinema?.numberSeats}
                                </div>
                                
                            </div>
                            <div className="p-grid p-col-12" >
                                <div className="p-col-12">
                                    Ghế: <>{renderNameSeat()}</>
                                </div>
                            </div>
                            <div className="p-grid p-col-12" >
                                <div className="p-col-6">
                                    Số lượng vé: {selectedSeat.length}
                                </div>
                                <div className="p-col-6">
                                    Thành tiền: {numberFormat((selectedSeat.length)*data?.cinema?.price)}
                                </div>
                            </div>
                            <div className="p-grid p-col-12">
                                <div className="p-col-3">
                                    Thanh toán: 
                                </div>
                                <div className="p-col-4">
                                    <Checkbox  onChange={() => setTypePayment(true)} checked={typePayment}></Checkbox>
                                    Tiền mặt khi nhận vé
                                    
                                </div>
                                <div className="p-col-4">
                                    <Checkbox  onChange={() => setTypePayment(false)} checked={!typePayment}></Checkbox>
                                    Qua thẻ
                                </div>
                                
                            </div>
                            <div className="p-grid" style={{justifyContent:'center'}}>
                                <Button label="Đặt vé" className="p-button-rounded p-button-success" onClick={onBookTickets}/>
                            </div>
                        </div>
                    </div>
                    </>)
                    :
                    <h2 style={{textAlign:'center'}}>Suất chiếu đã qua hoặc không tồn tại</h2>
                )

            }       
            <Footer/>
        </div>
    </>
    )
}

export default UserSessionDetail
