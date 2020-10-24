import { Context } from 'store/index';
import React, { useContext } from 'react';
import { Spinner } from 'reactstrap';

function Loading() {
    const { state } = useContext(Context);
    if (state.loading.loading) {
        return (
            <div className='dim-background'>
                <Spinner animation="border" role="status"/>
            </div>
        );
    } else {
        return <></>
    }   
}

export default Loading;
