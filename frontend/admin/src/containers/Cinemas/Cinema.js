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
                    toast.current.show({severity:'success', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                }else{
                    toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                }
                reloadData();
            })
            .catch((error)=>{
                console.log(error);
                toast.current.show({severity:'error', summary: 'Th??ng b??o', detail:'L???i h??? th???ng', life: 3000});
        });
    }
    const rejectFunc = () =>{

    }

    const confirm = () => {
        if(selectedList.id == null){
            toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: 'B???n ch??a ch???n d??ng c???n xo??.', life: 3000});
        }else
            confirmDialog({
                message: 'B???n c?? mu???n xo?? R???p s???: '+selectedList.name+' ? ',
                header: 'Th??ng b??o',
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
                errors.name = 'T??n r???p kh??ng ???????c ????? tr???ng.';
            }
            if (data.typeOfCinema === '') {
                errors.typeOfCinema = 'Lo???i r???p kh??ng ???????c thi???u.';
            }
            if (!data.numberSeats || data.numberSeats === '') {
                errors.numberSeats = 'S??? l?????ng gh??? kh??ng ???????c thi???u.';
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
                        toast.current.show({severity:'success', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                        reloadData();
                        setDisplayModal(false);
                    }else{
                        toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: res.data.message, life: 3000});
                    }
                    
                })
                .catch((error)=>{
                    console.log(error);
                    toast.current.show({severity:'error', summary: 'Th??ng b??o', detail:'L???i h??? th???ng', life: 3000});
            });
        }
    });

    const footer = (
        <div>
            <Button label={isInsert ? 'Th??m': 'C???p nh???t'} icon="pi pi-check" onClick={formik.handleSubmit}/>
            <Button label="Hu???" icon="pi pi-times" onClick={() =>setDisplayModal(false)}/>
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
            toast.current.show({severity:'warn', summary: 'Th??ng b??o', detail: 'B???n ch??a ch???n d??ng c???n c???p nh???t.', life: 3000});
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
        <Panel header="Danh s??ch c??c r???p phim">
            <Toast ref={toast} />
            <div className="p-grid">
                <div className="p-field p-mr-2">
                    <Button label="Th??m" icon="pi pi-plus" className="p-button-success" onClick={createCategory}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="S???a" icon="pi pi-pencil" className="p-button-info" onClick={updateCategory}/>
                </div>
                <div className="p-field p-mr-2">
                    <Button label="Xo??" icon="pi pi-times" className="p-button-danger" onClick={confirm}/>
                </div>
            </div>
            <div className="p-grid">
                <Dialog header={isInsert ? 'Th??m m???i' : 'C???p nh???t'} onHide={() => setDisplayModal(false)} visible={displayModal} footer={footer}  breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="p-grid">
                            <div className="p-field p-mt-4 p-col-6">
                                <label htmlFor="name">R???p s???</label>
                                <span className="p-float-label"> 
                                    <InputNumber id="name" name="name" value={formik.values.name} 
                                    disabled={!isInsert}
                                    onValueChange={formik.handleChange} mode="decimal" autoFocus showButtons min={1}/>
                                </span>
                                <small className="p-error p-d-block">{formik.touched.name ? formik.errors.name : ''}</small>
                            </div>
                            <div className="p-field p-mt-4 p-col-6">
                                <label htmlFor="price">Gi??</label>
                                <span className="p-float-label">
                                    <InputText id="price"  disabled={true} name="price" 
                                    value={numberFormat(priceTypeCinema)} onChange={formik.handleChange} autoFocus />
                                </span>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-field p-col-6">
                                <label htmlFor="typeOfCinema">Lo???i r???p</label>
                                <span className="p-float-label">
                                    <Dropdown
                                        id="typeOfCinema"
                                        name="typeOfCinema"
                                        placeholder={'Ch???n lo???i r???p'}
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
                                <label htmlFor="numberSeats">S??? l?????ng gh???</label>
                                <span className="p-float-label">
                                    <Dropdown
                                        id="numberSeats"
                                        name="numberSeats"
                                        placeholder={'Ch???n s??? l?????ng gh???'}
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
                        emptyMessage="Kh??ng c?? r???p n??o">
                        <Column field="name" header="R???p s???" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="type" header="Lo???i r???p" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="numberSeats" header="S??? l?????ng gh???" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="price" header="Gi?? ti???n" body={(rowData) => numberFormat(rowData.price)} style={{right: '0px'}} sortable filter filterPlaceholder="Search by name"></Column>

                        <Column field="createdDate" header="Ng??y t???o" body={(rowData) => toDateTimeString(rowData.createdDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="createdBy" header="Ng?????i t???o" sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateDate" header="Ng??y c???p nh???t" body={(rowData) => toDateTimeString(rowData.updateDate)} sortable filter filterPlaceholder="Search by name"></Column>
                        <Column field="updateBy" header="Ng?????i c???p nh???t" sortable filter filterPlaceholder="Search by name"></Column>
                    </DataTable>
            </div>
        </Panel>
    )
}
