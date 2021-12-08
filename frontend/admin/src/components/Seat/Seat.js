import { useState,useEffect,useRef } from 'react';
import { Button } from 'primereact/button';

const Seat = (props) => {
    const[status, setStatus] = useState(0);
    
    const onClick = () =>{    
        if(status == 0) {
            setStatus(1);
            props.onAddSeat(props.labelIndex);
        }
        else if(status == 1) {
            setStatus(0);
            props.onRemoveSeat(props.labelIndex);
        }
    }

    useEffect(() => {
        setStatus(props.status);
    }, [])

    const getColorByStatus = () =>{
        if(status == 0)
            return 'p-mr-1 p-button-info  p-button-outlined';
        else if(status == 1)
            return 'p-mr-1 p-button-info ';
        else if(status == 2)
            return 'p-mr-1 p-button-raised p-button-secondary';
    }

    const onTouch = () =>{
        setStatus(1);
    }

    return (
        <div>
            <Button label={props.labelIndex} className={getColorByStatus()}  onClick={onClick} style={{width:'50px'}} disabled={status == 2 ? true : false} onTouchMove={onTouch}/>
        </div>
    )
}

export default Seat
