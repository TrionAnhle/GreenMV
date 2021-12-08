import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState,useEffect } from 'react';
import API from '../../utils/request';
import { toDateTString } from "../../utils/date";
import {numberFormat} from '../../utils/number';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import QRCode from 'qrcode.react';

function AccountSessionPage() {
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [displayModal, setDisplayModal] = useState(false);

    useEffect(() => {
        API.get('/api/user/receipt/'+localStorage.getItem('id'), 
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
        setSelectedRow({});
    }, []);

    const setSelectedRowCustomize = (e) => {
        setSelectedRow(e.value);
    };

    const renderTotal = (rowData) =>{
        return numberFormat(rowData.cinemaPrice * rowData.tickets.length);
    }

    const showDetailReceipt = (rowData) =>{
        setSelectedRow({...rowData})
        setDisplayModal(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <Button type="button" label="Chi tiết" 
            onClick={(rowData) => showDetailReceipt(rowData)} className="p-button-rounded p-button-help"></Button>
        );
    }

    const renderNameSeat = () =>{
        return(<>
            {selectedRow.tickets?.map((ele,index)=>{
                return (index > 0 ? ',':'')+ele;
            })}
        </>);
    }

    return (
        <div style={{textAlign:'center'}}>
            <div className="p-mb-4"><h2>Thông tin hoá đơn</h2></div>
            <Dialog header={'Chi tiết hoá đơn'} onHide={() => setDisplayModal(false)} visible={displayModal} 
            breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '50vw'}}>
            
                <div className="p-grid p-col-12">
                    <div className="p-col-6">
                        Tên phim: {selectedRow?.movieName}
                    </div>
                    <div className="p-col-6">
                        Ngày giờ: {toDateTString(selectedRow?.showTime)}
                    </div>
                </div>
                <div className="p-grid p-col-12">
                    <div className="p-col-6">
                        Rạp số: {selectedRow?.cinemaName}
                    </div>
                    <div className="p-col-6">
                        Loại rạp: {selectedRow?.cinemaType}
                    </div>
                </div>
                <div className="p-grid p-col-12" >
                    <div className="p-col-12">
                        Ghế: <>{renderNameSeat()}</>
                    </div>
                </div>
                <div className="p-grid p-col-12" >
                    <div className="p-col-6">
                        Số lượng vé: {selectedRow?.tickets?.length}
                    </div>
                    <div className="p-col-6">
                        Thành tiền: {numberFormat(selectedRow?.cinemaPrice * selectedRow?.tickets?.length)}
                    </div>
                </div>
                <div className="p-gird p-col-12">
                    Thanh toán: {selectedRow?.paymentType == 0 ? 'Tiền mặt khi nhận vé' : 'Qua thẻ'}
                    
                </div>
                <div className="p-grid p-col-12"> 
                    <div className="p-col-6">
                        <label htmlFor="status" className="p-mt-1">Trạng thái</label>
                        {selectedRow?.isGetTicket ? 
                        <Button label="ĐÃ LẤY" id="status" name="status" className="p-button-success p-ml-2" />:
                        <Button label="CHƯA LẤY" id="status" name="status" className="p-button-warning p-ml-2" />}
                    </div>     
                    <div className="p-col-6">
                        <QRCode value={selectedRow?.id+''} />
                    </div>               
                </div>
            </Dialog>
            <div className="card">
                <DataTable value={data} paginator rows={10}
                    selection={selectedRow} 
                    onSelectionChange={setSelectedRowCustomize} 
                    selectionMode="single" 
                    dataKey="id"
                    stateStorage="local" 
                    stateKey="dt-state-demo-local"
                    emptyMessage="Không có hoá đơn">
                    <Column field="movieName" header="Tên phim" sortable ></Column>
                    <Column field="cinemaName" header="Rạp số" sortable ></Column>
                    <Column field="cinemaType" header="Loại rạp" sortable ></Column>
                    <Column field="showTime" header="Ngày giờ chiếu" body={(rowData) => toDateTString(rowData.showTime)} sortable ></Column>
                    <Column field="createdDate" header="Ngày đặt" body={(rowData) => toDateTString(rowData.createdDate)} sortable></Column>
                    <Column field="price" header="Tổng tiền" body={(rowData) => renderTotal(rowData)} style={{right: '0px'}} sortable ></Column>
                    <Column body={(rowData) => actionBodyTemplate(rowData)} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                </DataTable>
            </div>
        </div>
    )
}

export default AccountSessionPage
