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
import {Password} from 'primereact/password';

import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { APPCONFIG } from '../utils/constants';
import { FileUpload } from 'primereact/fileupload'; 
import {Checkbox} from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';

function Staff() {
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [isInsert, setIsInsert] = useState(true);
    const [showDetail, setShowDetail] = useState([]);
    const [sex, setSex] = useState(true);
    const initDetail = [
        <Column field="createdDate" header="Ngày tạo" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable filter filterPlaceholder="Search by name"></Column>,
        <Column field="createdBy" header="Người tạo" sortable filter filterPlaceholder="Search by name"></Column>,
        <Column field="updateDate" header="Ngày cập nhật" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable filter filterPlaceholder="Search by name"></Column>,
        <Column field="updateBy" header="Người cập nhật" sortable filter filterPlaceholder="Search by name"></Column>
    ]

    useEffect(() => {
        reloadData();
    }, [])

    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };
   

    const reloadData =  () =>{
        API.get('/api/admin/staff', 
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
        API.post('/api/admin/staff/delete', [selectedList.id], 
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
                message: 'Bạn có muốn '+(selectedList.isDelete ? 'mở' : 'khoá')+' - tài khoản: '+selectedList.username+' ? ',
                header: 'Thông báo',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteItem(),
                reject: () => rejectFunc()
            });
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            username : '',
            password : '',
            fullName : '',
            name : '',
            sex : '',
            phone : '',
            address : ''
        },
        validate: (data) => {
            const errors = {};
            if(!data.username.trim()){
                errors.username = 'Username không được để trống';
            }
            if(isInsert){
                if(!data.password.trim()){
                    errors.password = 'Password không được để trống';
                }
            }
            if(!data.fullName.trim()){
                errors.fullName = 'Họ tên không được để trống';
            }
            if(!data.phone.trim()){
                errors.phone = 'Số điện thoại không được để trống';
            }
            return errors;
        },
        onSubmit: (data) => {
            console.log(data);
            let API_URL = (isInsert ? '/api/auth/signup/staff' : '/api/admin/staff');
            data.sex = sex;
            API.post(API_URL, data, 
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

    const create = () =>{
        setDisplayModal(true);
        setIsInsert(true);
        formik.resetForm();
        
    };

    const update = () =>{
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn dòng cần cập nhật.', life: 3000});
        }else{
            setDisplayModal(true);
            setIsInsert(false);
            
            
            formik.setFieldValue('id' , selectedList.id);
            formik.setFieldValue('username' , selectedList.username);
            formik.setFieldValue('email ' , selectedList.email);
            formik.setFieldValue('fullName' , selectedList.fullName);
            setSex(selectedList.sex);
            formik.setFieldValue('phone' , selectedList.phone);
            formik.setFieldValue('address' , selectedList.address);
        }
    };

    
    const addDetailColum = () =>{
        if(showDetail.length > 0) setShowDetail([]);
        else setShowDetail(initDetail);
    }
    
    
    

    const sexBodyTemplate = (rowData) => {
        return (rowData.sex ? 'NAM' : 'NỮ');
    }
    
    const statusBodyTemplate = (rowData) => {
        return ( rowData.isDelete ?
            <Button label="KHOÁ" className="p-button-danger" /> : 
            <Button label="HOẠT ĐỘNG" className="p-button-success" />);
    }
    
    return (
        <Panel header="Danh sách các phim">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Thêm" icon="pi pi-plus" className="p-button-success" onClick={create}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Sửa" icon="pi pi-pencil" className="p-button-info" onClick={update}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Mở/Khoá tài khoản" icon="pi pi-unlock" className="p-button-danger" onClick={confirm}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Xem chi tiết" icon="pi pi-book" className="p-button-help" onClick={()=> addDetailColum()}/>
                </div>
            </div>
            <div className="p-grid">
                <Dialog header={isInsert ? 'Thêm mới' : 'Cập nhật'} maximizable onHide={() => setDisplayModal(false)} visible={displayModal} footer={footer}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-grid">
                            <div className="p-col-6">
                                <label htmlFor="username" class="p-mb-2">Username</label>
                                <InputText id="username" value={formik.values.username} onChange={formik.handleChange} autoFocus disabled={!isInsert}/>
                                <small className="p-error p-d-block">{formik.touched.username? formik.errors.username: ''}</small>
                            </div>
                            <div className="p-col-6">
                                <label htmlFor="password" class="p-mb-2">Password</label>
                                <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask disabled={!isInsert}/>
                                <small className="p-error p-d-block">{formik.touched.password? formik.errors.password: ''}</small>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-6">
                                <label htmlFor="fullName" class="p-mb-2">Họ tên</label>
                                <InputText id="fullName" value={formik.values.fullName} onChange={formik.handleChange} autoFocus />
                                <small className="p-error p-d-block">{formik.touched.fullName? formik.errors.fullName: ''}</small>
                            </div>
                            <div className="p-col-6">
                                <label htmlFor="phone" class="p-mb-2">Số điện thoại</label>
                                <InputText id="phone" value={formik.values.phone} onChange={formik.handleChange} keyfilter="num" autoFocus maxLength={10} minLength={6}/>
                                <small className="p-error p-d-block">{formik.touched.phone? formik.errors.phone: ''}</small>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-6">
                                <div className="p-grid p-mt-3">
                                <div className="p-col-6">
                                    <Checkbox  id="sex" onChange={() => setSex(true)} checked={sex}></Checkbox>
                                    <label htmlFor="sex" className="p-checkbox-label">Nam</label>
                                </div>
                                <div className="p-col-6">
                                    <Checkbox  id="sex" onChange={() => setSex(false)} checked={!sex}></Checkbox>
                                    <label htmlFor="sex" className="p-checkbox-label">Nữ</label>
                                </div>
                                </div>
                            </div>
                            <div className="p-col-6">
                                
                                    <label htmlFor="address" class="p-mb-2">Địa chỉ</label>
                                    <InputTextarea value={formik.values.address}
                                    id="address" 
                                    onChange={formik.handleChange}
                                    rows={2} cols={30} autoResize />
                                
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
                        emptyMessage="Không có nhân viên nào">  
                        <Column field="fullName" header="Họ tên" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="sex"  body={(rowData) => sexBodyTemplate(rowData)} header="Giới tính" sortable filter filterPlaceholder="Search by name"></Column> 
                        <Column field="phone" header="Số điện thoại" sortable filter></Column>
                        <Column field="username" header="Tài khoản" sortable filter></Column>
                        <Column field="role" header="Vai trò" sortable filter></Column>
                        <Column field="isDelete" header="Trạng thái" sortable body={statusBodyTemplate}></Column>
                       
                        {showDetail}
                    </DataTable>
                </div>
            </div>
        </Panel>
    )
}

export default Staff;
