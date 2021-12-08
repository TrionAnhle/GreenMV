import React, { useState,useEffect,useRef } from 'react';
import API from '../../utils/request'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Checkbox} from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { useHistory } from "react-router-dom";


function AccountDetailPage() {
    const [sex, setSex] = useState(true);
    const history = useHistory();
    const toast = useRef(null);

    useEffect(() => {
        reloadDataUser();
    }, []);

    const reloadDataUser = () =>{
        API.post('/api/user/customer/username', {username:localStorage.getItem('username')}, 
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
        .then((res) =>{
            let data = res.data.data[0];
            formik.setFieldValue('id' , data.id);
            formik.setFieldValue('email' , data.email);
            formik.setFieldValue('fullName' , data.fullName);
            setSex(data.sex);
            formik.setFieldValue('phone' , data.phone);
            formik.setFieldValue('address' , data.address);
        })
        .catch((error)=>{
            if(error.response.status === 401){
                history.push("/login");
            }
        });
    }

    const formik = useFormik({
        initialValues: {
            id: '',
            email : '',
            fullName : '',
            sex : '',
            phone : '',
            address : '',
        },
        validate: (data) => {
            const errors = {};
            
            if(!data.fullName.trim()){
                errors.fullName = 'Họ tên không được để trống';
            }
            if(!data.phone.trim()){
                errors.phone = 'Số điện thoại không được để trống';
            }
            return errors;
        },
        onSubmit: (data) => {
            data.sex = sex;
            API.post('/api/user/customer/info', data, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                }})
                    .then((res) =>{
                        if(res.data.ok){
                            toast.current.show({severity:'success', summary: 'Thông báo', detail: res.data.message, life: 3000});
                            reloadDataUser();
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

    return (
        <div>
        <Toast ref={toast} />
        <div className="p-mb-4" style={{textAlign:'center'}}><h2>Thông tin cá nhân</h2></div>
        <form onSubmit={formik.handleSubmit} className="p-fluid" style={{backgroundColor:'white', color:'black'}}>
            <div className="p-grid p-col-12">
                <div className="p-col-6">
                    <label htmlFor="username" class="p-mb-2">Username</label>
                    <InputText id="username" value={localStorage.getItem('username')}  autoFocus disabled={true}/>
                </div>
                <div className="p-col-6">
                    <label htmlFor="email" class="p-mb-2">Email</label>
                    <InputText id="email" value={formik.values.email} onChange={formik.handleChange} autoFocus />
                    <small className="p-error p-d-block">{formik.touched.email? formik.errors.email: ''}</small>
                </div>
            </div>
            <div className="p-grid p-col-12">
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
            <div className="p-grid p-col-12">
                <div className="p-col-6">
                    <div className="p-grid p-mt-3">
                        <div className="p-col-6">
                            Giới tính:
                            <Checkbox  id="sex" onChange={() => setSex(true)} checked={sex} className="p-ml-2"></Checkbox>
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
                <div className="p-grid p-col-12" style={{textAlign:'center'}}>
                    <div className="p-col-12" >
                     <Button label="Cập nhật" className="p-button-raised p-button-success" style={{width: '200px'}} onClick={formik.handleSubmit}/>
                    </div>
                    
                </div>
            </div>
        </form>
        </div>
    )
}

export default AccountDetailPage
