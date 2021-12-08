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
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

export default function Cinema() {
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [isInsert, setIsInsert] = useState(true);
    const [priceTypeCinema, setPriceTypeCinema] = useState(0);
    const listTypeCinema = [
        {id : 0, name : 'RAP_2D', price : 60000},
        {id : 1, name : 'RAP_3D', price : 70000},
        {id : 2, name : 'RAP_IMAX', price : 100000},
    ]

    const listNumberSeat = [
        {id : 40, name : '40'},
        {id : 50, name : '50'}
    ]

    useEffect(() => {
        reloadData();
    }, [])

    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };
    
    const reloadData = () =>{
        API.get('/api/admin/cinema', 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) =>{
                setData(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
        });
        setSelectedList({});
    }
    
    const deleteItem = () => {
        API.post('/api/admin/cinema/delete', [selectedList.id], 
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
                reloadData();
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
                message: 'Bạn có muốn xoá Rạp số: '+selectedList.name+' ? ',
                header: 'Thông báo',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteItem(),
                reject: () => rejectFunc()
            });
    }

    const formik = useFormik({
        initialValues: {
            id : '',
            name : 0,
            typeOfCinema : '',
            numberSeats : '',
        },
        validate: (data) => {
            const errors = {};
            if (!data.name) {
                errors.name = 'Tên rạp không được để trống.';
            }
            if (data.typeOfCinema === '') {
                errors.typeOfCinema = 'Loại rạp không được thiếu.';
            }
            if (!data.numberSeats || data.numberSeats === '') {
                errors.numberSeats = 'Số lượng ghế không được thiếu.';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            API.post('/api/admin/cinema', data, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
            }})
                .then((res) =>{
                    if(res.data.ok){
                        toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                        reloadData();
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

    const createCategory = () =>{
        setDisplayModal(true);
        setIsInsert(true);
        setPriceTypeCinema(0);
        formik.setFieldValue('id' , '');
        formik.setFieldValue('name' , 0);
        formik.setFieldValue('typeOfCinema' , '');
        formik.setFieldValue('numberSeats' , '');
    };

    const updateCategory = () =>{
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn dòng cần cập nhật.', life: 3000});
        }else{
            setDisplayModal(true);
            setIsInsert(false);
            formik.setFieldValue('id' , selectedList.id);
            formik.setFieldValue('name' , selectedList.name);
            const idType = listTypeCinema.find(ele => ele.name === selectedList.type).id;
            formik.setFieldValue('typeOfCinema' , idType);
            setPriceTypeCinema(listTypeCinema[idType].price);
            formik.setFieldValue('numberSeats' , selectedList.numberSeats);}
    };

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <Panel header="Danh sách các rạp phim">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={createCategory}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Sửa" icon="pi pi-pencil" className="p-button-info" onClick={updateCategory}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Xoá" icon="pi pi-times" className="p-button-danger" onClick={confirm}/>
                </div>
            </div>
            <div className="p-grid">
                <Dialog header={isInsert ? 'Thêm mới' : 'Cập nhật'} onHide={() => setDisplayModal(false)} visible={displayModal} footer={footer}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-grid">
                            <div className="p-field p-mt-4 p-col-6">
                                <label htmlFor="name">Rạp số</label>
                                <span className="p-float-label"> 
                                    <InputNumber id="name" name="name" value={formik.values.name} 
                                    disabled={!isInsert}
                                    onValueChange={formik.handleChange} mode="decimal" autoFocus showButtons min={1}/>
                                </span>
                                <small className="p-error p-d-block">{formik.touched.name ? formik.errors.name : ''}</small>
                            </div>
                            <div className="p-field p-mt-4 p-col-6">
                                <label htmlFor="price">Giá</label>
                                <span className="p-float-label">
                                    <InputText id="price"  disabled={true} name="price" 
                                    value={numberFormat(priceTypeCinema)} onChange={formik.handleChange} autoFocus />
                                </span>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="typeOfCinema">Loại rạp</label>
                                <span className="p-float-label">
                                    <Dropdown
                                        id="typeOfCinema"
                                        name="typeOfCinema"
                                        placeholder={'Chọn loại rạp'}
                                        options={listTypeCinema}
                                        optionLabel="name"
                                        optionValue="id"
                                        {...formik.getFieldProps('typeOfCinema')}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            setPriceTypeCinema(listTypeCinema.find(ele => ele.id === e.value).price);
                                        }}
                                        className="p-inputtext-sm"
                                    />
                                </span>
                                <small className="p-error p-d-block">{formik.touched.typeOfCinema? formik.errors.typeOfCinema: ''}</small>
                            </div>
                            <div className="p-field p-col-6">
                                <label htmlFor="numberSeats">Số lượng ghế</label>
                                <span className="p-float-label">
                                    <Dropdown
                                        id="numberSeats"
                                        name="numberSeats"
                                        placeholder={'Chọn số lượng ghế'}
                                        options={listNumberSeat}
                                        optionLabel="name"
                                        optionValue="id"
                                        {...formik.getFieldProps('numberSeats')}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        className="p-inputtext-sm"
                                    />
                                </span>
                                <small className="p-error p-d-block">{formik.touched.numberSeats ? formik.errors.numberSeats : ''}</small>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
            <div className="card">
                    <DataTable value={data} paginator rows={10}
                        selection={selectedList} 
                        onSelectionChange={setSelectedRowCustomize} 
                        selectionMode="single" 
                        dataKey="id"
                        stateStorage="local" 
                        stateKey="dt-state-demo-local"
                        emptyMessage="Không có rạp nào">
                        <Column field="name" header="Rạp số" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="type" header="Loại rạp" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="numberSeats" header="Số lượng ghế" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="price" header="Giá tiền" body={(rowData) => numberFormat(rowData.price)} style={{right: '0px'}} sortable filter filterPlaceholder="Search by name"></Column>

                        <Column field="createdDate" header="Ngày tạo" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="createdBy" header="Người tạo" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateDate" header="Ngày cập nhật" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateBy" header="Người cập nhật" sortable filter filterPlaceholder="Search by name"></Column>
                    </DataTable>
            </div>
        </Panel>
    )
}
