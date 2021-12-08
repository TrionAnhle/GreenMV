import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toDateTimeString } from "../utils/date";
import { numberFormat } from "../utils/number";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

function Session() {
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [listCategories, setListCategories] = useState([]);
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [isInsert, setIsInsert] = useState(true);
    const [checked, setChecked] = useState(false);
    const [control, setControl] = useState(true);

    const [listMovie, setListMovie] = useState(null);
    const [listCinema, setListCinema] = useState(null);
    const listStatus = [
        {id : 0, name : "Tất cả"},
        {id : 1, name : "Chưa chiếu"}
    ];
    const [status, setStatus] = useState(listStatus[0]);

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let minDate = new Date();
    minDate.setMonth(prevMonth);
    minDate.setFullYear(prevYear);

    useEffect(() => {
        reloadData(0);
        if(localStorage.getItem('role') === 'ROLE_ADMIN') {
            setControl(false);
        };
        
    }, [])

    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };

    const getListMovie = () =>{
        API.get('/api/admin/movie', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setListMovie(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
    }
    
    const getListCinema = () =>{
        API.get('/api/admin/cinema', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setListCinema(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
    }
    
    const reloadDatabyStatus =  () =>{
        let urlAPI = (status.id == 0 ? '/api/admin/session' : '/api/admin/session/available');

        API.get(urlAPI, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setData(res.data.data);
                console.log(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
        setSelectedList({});
    }

    const reloadData =  (status) =>{
        let urlAPI = (status == 0 ? '/api/admin/session' : '/api/admin/session/available');

        API.get(urlAPI, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setData(res.data.data);
                console.log(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
        setSelectedList({});
    }
    
    const deleteItem = () => {
        API.post('/api/admin/session/delete', [selectedList.id], 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                if(res.data.ok){
                    toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }else{
                    toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                }
                reloadDatabyStatus();
            })
            .catch((error)=>{
                console.log(error);
                toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
        });
    }
    const rejectFunc = () =>{

    }

    const confirm = () => {
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn dòng cần xoá.', life: 3000});
        }else
            confirmDialog({
                message: 'Suất chiếu lúc: '+toDateTimeString(selectedList.showTime)+' - Phim: '+selectedList.movie.name+' - Rạp: '+selectedList.cinema.name,
                header: 'Bạn có muốn xoá ?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteItem(),
                reject: () => rejectFunc()
            });
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            movieId: '',
            cinemaId: '',
            time: ''
        },
        validate: (data) => {
            const errors = {};
            if(!data.cinemaId){
                errors.cinemaId = 'Rạp không được thiếu.';
            }
            if(!data.movieId){
                errors.movieId = 'Phim không được thiếu.';
            }
            if(!data.time && isInsert){
                errors.time = 'Thời gian chiếu không được thiếu.';
            }
            return errors;
        },
        onSubmit: (data) => {
            
            data.time = data.time.getFullYear()+'-'+(data.time.getMonth()+1)+'-'+data.time.getDate()+' '+
                        data.time.getHours()+':'+data.time.getMinutes()+':'+data.time.getSeconds();
            
            API.post('/api/admin/session', data, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    console.log(res.data);
                    if(res.data.ok){
                        toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                        reloadDatabyStatus();
                        setDisplayModal(false);
                    }else{
                        toast.current.show({severity:'warn', summary: 'Thông báo', detail: res.data.message, life: 3000});
                    }
                    
                })
                .catch((error)=>{
                    console.log(error);
                    toast.current.show({severity:'error', summary: 'Thông báo', detail:'Lỗi hệ thống', life: 3000});
            });
        }
    });

    const footer = (
        <div>
            <Button label={isInsert ? 'Thêm': 'Cập nhật'} icon="pi pi-check" onClick={formik.handleSubmit}/>
            <Button label="Huỷ" icon="pi pi-times" onClick={() =>setDisplayModal(false)}/>
        </div>
    );

    const create = () =>{
        setDisplayModal(true);
        setIsInsert(true);
        getListMovie();
        getListCinema();
        formik.setFieldValue('id' , '');
        formik.setFieldValue('cinemaId' , '');
        formik.setFieldValue('movieId' , '');
        formik.setFieldValue('time' , '');
    };

    const update = () =>{
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn dòng cần cập nhật.', life: 3000});
        }else{
            setDisplayModal(true);
            setIsInsert(false);
            getListMovie();
            getListCinema();
            formik.setFieldValue('id' , selectedList.id);
            formik.setFieldValue('cinemaId' , selectedList.cinema.id);
            formik.setFieldValue('movieId' , selectedList.movie.id);
            formik.setFieldValue('time' , new Date(selectedList.showTime));
        }
    };
    
    

    
    
    

    const toBookedTicket = (rowData) =>{
        return rowData.numberBooked +'/'+rowData.cinema.numberSeats;
    }

    const toDateOfWeek = (rowData) => {
        const birthday = new Date(rowData.showTime);
        const day = birthday.getDay();
        return (day === 0 ? 'Chủ nhật' : 'Thứ '+(day+1));
    }

    return (
        <Panel header="Danh sách các suất chiếu">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={create} disabled={control}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Sửa" icon="pi pi-pencil" className="p-button-info" onClick={update} disabled={control}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Xoá" icon="pi pi-times" className="p-button-danger" onClick={confirm} disabled={control}/>
                </div>
            </div>
            <div className="p-grid p-mb-5">
                <Dropdown
                    id="status"
                    name="status"
                    value={status}
                    //placeholder={'Trạng thái'}
                    options={listStatus}
                    optionLabel="name"
                    optionValue="id"
                    onChange={(e) => {
                        setStatus(e.value);
                        reloadData(e.value);
                    }}
                    className="p-inputtext-sm"
                />
            </div>
            <div className="p-grid">
                <Dialog header={isInsert ? 'Thêm mới' : 'Cập nhật'} maximizable onHide={() => setDisplayModal(false)} visible={displayModal} footer={footer}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-grid">
                            <div className="p-field p-mt-4 p-col-6 ">
                                <label htmlFor="cinemaId" class="p-mb-2">Rạp số</label>
                                <Dropdown
                                    id="cinemaId"
                                    name="cinemaId"
                                    placeholder={'Chọn rạp'}
                                    options={listCinema}
                                    optionLabel="name"
                                    optionValue="id"
                                    {...formik.getFieldProps('cinemaId')}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                    }}
                                    className="p-inputtext-sm"
                                />
                                <small className="p-error p-d-block">{formik.touched.cinemaId ? formik.errors.cinemaId : ''}</small>
                            </div>
                            <div className="p-field p-mt-4 p-col-6 ">
                                <label htmlFor="movieId" class="p-mb-2">Phim</label>
                                <Dropdown
                                    id="movieId"
                                    name="movieId"
                                    placeholder={'Chọn phim'}
                                    options={listMovie}
                                    optionLabel="name"
                                    optionValue="id"
                                    {...formik.getFieldProps('movieId')}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                    }}
                                    className="p-inputtext-sm"
                                />
                                <small className="p-error p-d-block">{formik.touched.movieId ? formik.errors.movieId : ''}</small>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-field p-mt-4 p-col-12 ">
                                <label htmlFor="time" class="p-mb-2">Thời gian chiếu</label>
                                <Calendar id="time" value={formik.values.time}  dateFormat="dd/mm/yy"
                                {...formik.getFieldProps('time')} 
                                onChange={formik.handleChange} showTime showSeconds />
                                <small className="p-error p-d-block">{formik.touched.time ? formik.errors.time : ''}</small>

                                

                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
            <div className="datatable-templating-demo">
                <div className="card">
                    <DataTable value={data} paginator rows={10} scrollable scrollHeight="500px"
                        selection={selectedList} 
                        onSelectionChange={setSelectedRowCustomize} 
                        selectionMode="single" 
                        dataKey="id"
                        stateStorage="local" 
                        stateKey="dt-state-demo-local"
                        emptyMessage="Không có suất chiếu nào">
                        
                        <Column field="cinema.name" header="Rạp số" sortable filter filterPlaceholder="Search..."></Column>
                        <Column field="movie.name" header="Tên phim" sortable filter filterPlaceholder="Search..."></Column>
                        <Column field="movie.screenTime" header="Thời lượng phim" sortable filter filterPlaceholder="Search..."></Column>
                        <Column header="Thứ"  body={(rowData) => toDateOfWeek(rowData)} sortable filter filterPlaceholder="Search..."></Column>
                        <Column field="showTime" header="Giờ bắt đầu" body={(rowData) => toDateTimeString(rowData.showTime)} sortable filter filterPlaceholder="Search..."></Column>
                        <Column field="finishTime" header="Giờ kết thúc" body={(rowData) => toDateTimeString(rowData.finishTime)} sortable filter filterPlaceholder="Search..."></Column>
                        <Column header="Số vé bán" body={(rowData) => toBookedTicket(rowData)} sortable filter filterPlaceholder="Search..."></Column>

                    </DataTable>
                </div>
            </div>
        </Panel>
    )
}

export default Session
