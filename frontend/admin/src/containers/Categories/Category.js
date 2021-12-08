import { Panel } from 'primereact/panel';
import React, { useState,useEffect,useRef } from 'react';
import API from '../utils/request'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { toDateTimeString } from "../utils/date";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';


const Category = () => {
    const toast = useRef(null);
    const [data, setData] = useState({});
    const [selectedList, setSelectedList] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [isInsert, setIsInsert] = useState(true);    

    useEffect(() => {
        reloadData();
    }, [])

    const setSelectedRowCustomize = (e) => {
        setSelectedList(e.value);
    };
    
    const reloadData = () =>{
        API.get('/api/admin/category', 
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
        API.post('/api/admin/category/delete', [selectedList.id], 
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
                message: 'Bạn có muốn xoá \"'+selectedList.name+'\" ? ',
                header: 'Thông báo',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteItem(),
                reject: () => rejectFunc()
            });
    }

    const formik = useFormik({
        initialValues: {
            id : '',
            name: ''
        },
        validate: (data) => {
            const errors = {};
            if (!data.name) {
                errors.name = 'Tên thể loại không được để trống.';
            }
            return errors;
        },
        onSubmit: (data) => {
            API.post('/api/admin/category', data, 
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
                    setDisplayModal(false);
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
        formik.setFieldValue('id' , '');
        formik.setFieldValue('name' , '');
    };

    const updateCategory = () =>{
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Thông báo', detail: 'Bạn chưa chọn dòng cần cập nhật.', life: 3000});
        }else{
            setDisplayModal(true);
            setIsInsert(false);
            formik.setFieldValue('id' , selectedList.id);
            formik.setFieldValue('name' , selectedList.name);
        }
        
    };

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    

    return (
        <Panel header="Danh sách thể loại phim">
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
                        <div className="p-field p-mt-4">
                            <label htmlFor="name">Tên thể loại</label>
                            <span className="p-float-label">
                                <InputText id="name" placeholder='Tên thể loại' name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus />
                            </span>
                            <small className="p-error p-d-block">{formik.touched.name ? formik.errors.name : ''}</small>
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
                        emptyMessage="Không có thể loại nào">
                        <Column field="name" header="Tên thể loại" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="createdDate" header="Ngày tạo" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="createdBy" header="Người tạo" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateDate" header="Ngày cập nhật" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateBy" header="Người cập nhật" sortable filter filterPlaceholder="Search by name"></Column>
                    </DataTable>
            </div>
        </Panel>
    )
}
export default Category;