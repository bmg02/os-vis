import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import { Drawer, InputField, Switch } from '../components';

function Algo(props) {

    const [ switchState, setSwitchState ] = React.useState(false);

    const handleChange = (event) => {
        setSwitchState(event.target.checked);
    };


    return (
        <React.Fragment>
            <Drawer content={
                <React.Fragment>
                    <br/><br/>
                    <div className='margin-20'><Switch checked={ switchState } onChange={ handleChange } label='I/O Bound' /></div>
                    <br/>
                    <div className='margin-10'>
                        <InputField value='2' type='number' />&nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{ fontFamily: 'Montserrat-Bold' }}>I/O Times</span>
                    </div>
                </React.Fragment>
            } />
            <div className='section-div section-margin-left'>
                <div className='section-heading extra-large'>{props.match.params.algo.replace(/-/g, ' ')}</div>
                <div className='extra-small margin-top-10'><Link to='/'>Change Algorithm</Link></div>
                <br/><br/>
                <MaterialTable
                    style={{
                        maxWidth: '1000px',
                        boxShadow: 'none',
                        border: '1px solid #CDCDCD',
                        borderRadius: '0'
                    }}
                    columns={[
                        { title: 'P. No.', field: 'pno', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'AT', field: 'atime', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'BT', field: 'btime1', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'IOBT', field: 'iobtime1', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'BT', field: 'btime2', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'IOBT', field: 'iobtime2', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'BT', field: 'btime3', cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD' } },
                        { title: 'CT', field: 'ctime', cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD' } },
                        { title: 'TAT', field: 'tatime', cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD' } },
                        { title: 'WT', field: 'wtime', cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD' } },
                        { title: 'RT', field: 'rtime', cellStyle: { textAlign: 'center', background: '#F7F7F7' } },

                    ]}
                    data={[
                        { pno: <InputField type='number' border='none' />, atime: <InputField type='number' border='none' />, btime1: <InputField type='number' border='none' />, iobtime1: <InputField type='number' border='none' />, btime2: <InputField type='number' border='none' />, iobtime2: <InputField type='number' border='none' />, btime3: <InputField type='number' border='none' /> },
                        { pno: <InputField type='number' border='none' />, atime: <InputField type='number' border='none' />, btime1: <InputField type='number' border='none' />, iobtime1: <InputField type='number' border='none' />, btime2: <InputField type='number' border='none' />, iobtime2: <InputField type='number' border='none' />, btime3: <InputField type='number' border='none' /> },
                        { pno: <InputField type='number' border='none' />, atime: <InputField type='number' border='none' />, btime1: <InputField type='number' border='none' />, iobtime1: <InputField type='number' border='none' />, btime2: <InputField type='number' border='none' />, iobtime2: <InputField type='number' border='none' />, btime3: <InputField type='number' border='none' /> }
                    ]}
                    options={{
                        sorting: false,
                        search: false,
                        toolbar: false,
                        paging: false,
                        draggable: false,
                        tableLayout: 'fixed',
                        headerStyle: {
                            background: '#DCDCDC',
                            textAlign: 'center',
                            fontFamily: 'Montserrat-Bold'
                        },
                    }}
                />
            </div>
        </React.Fragment>
    );
}

export default Algo;