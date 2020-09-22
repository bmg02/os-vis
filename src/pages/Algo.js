import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import { IconButton } from '@material-ui/core';
import { Drawer, InputField, InputFieldWithLabel, Switch, Button } from '../components';
import { ArrowDropDown, ArrowDropUp, Close, HelpOutline, History, PlayArrow } from '@material-ui/icons';
import './Algo.scss';
import { capitalizeEachWord } from '../util/general';

function Algo(props) {

    const [ ioBoundState, setIoBoundState ] = React.useState(false);

    const blankRow = {
        pno: '',
        atime: '',
        btime1: '',
        iobtime1: '',
        btime2: '',
        iobtime2: '',
        btime3: ''
    };
    
    const [ valueState, setValueState ] = React.useState({
        iotimes: 1,
        prcsData: [ blankRow, blankRow ]
    });

    const handleValueChange = (e) => {
        // let prcses = valueState.prcsData;
        // prcses.push(blankRow);
        // setValueState({ ...valueState, prcsData: prcses });
        // console.log(valueState.prcsData);
        // for (let i in valueState.prcsData) {
        //     for (let j in valueState.prcsData[i]) {
        //         console.log(valueState.prcsData[i][j]);
        //     }
        // }
    }

    // const handleAddNewRow = () => {
        
    // }

    const handleSwitchChange = (e) => setIoBoundState(e.target.checked);

    React.useEffect(() => {
        document.title = capitalizeEachWord(props.match.params.algo.replace(/-/g, ' ')) + ' at OS-VIS';
    }, []);


    return (
        <div style={{ display: 'flex' }}>
            <div>
                <div className='section-div section-margin-left'>
                    <div className='section-heading extra-large'>{ props.match.params.algo.replace(/-/g, ' ') }</div>
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
                            {
                                title: 'P. No.',
                                field: 'pno',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'pno-' + rowData.tableData.id } key={ 'pno-' + rowData.tableData.id } />
                            },
                            {
                                title: 'AT',
                                field: 'atime',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'atime-' + rowData.tableData.id } key={ 'atime-' + rowData.tableData.id } />
                            },
                            {
                                title: 'BT',
                                field: 'btime1',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'btime1-' + rowData.tableData.id } key={ 'btime1-' + rowData.tableData.id } />
                            },
                            {
                                title: 'IOBT',
                                field: 'iobtime1',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'iobtime1-' + rowData.tableData.id } key={ 'iobtime1-' + rowData.tableData.id } />
                            },
                            {
                                title: 'BT',
                                field: 'btime2',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'btime2-' + rowData.tableData.id } key={ 'btime2-' + rowData.tableData.id } />
                            },
                            {
                                title: 'IOBT',
                                field: 'iobtime2',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'iobtime2-' + rowData.tableData.id } key={ 'iobtime2-' + rowData.tableData.id } />
                            },
                            {
                                title: 'BT',
                                field: 'btime3',
                                cellStyle: { textAlign: 'center', border: '1px solid #CDCDCD', padding: '8px' },
                                render: rowData => <InputField type='number' border='none' onChange={ handleValueChange } id={ 'btime3-' + rowData.tableData.id } key={ 'btime3-' + rowData.tableData.id } />
                            },
                            {
                                title: 'CT',
                                field: 'ctime',
                                cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD', padding: '8px' },
                            },
                            {
                                title: 'TAT',
                                field: 'tatime',
                                cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD', padding: '8px' },
                            },
                            {
                                title: 'WT',
                                field: 'wtime',
                                cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD', padding: '8px' },
                            },
                            {
                                title: 'RT',
                                field: 'rtime',
                                cellStyle: { textAlign: 'center', background: '#F7F7F7', border: '1px solid #CDCDCD', padding: '8px' },
                            }
                        ]}
                        data={ valueState.prcsData }
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
                                fontFamily: 'Montserrat-Bold',
                                padding: '8px',
                            },
                            actionsCellStyle: {
                                width: 'max-content'
                            },
                            actionsColumnIndex: -1
                        }}
                        actions={[
                            {
                                icon: () => <Close style={{ fontSize: '16px', color: '#D91E2A' }} />,
                                tooltip: 'Remove',
                                onClick: (event, rowData) => {
                                    console.log(event, rowData);
                                }
                            },
                            {
                                icon: () => <ArrowDropUp style={{ fontSize: '24px', color: '#666' }} />,
                                tooltip: 'Move up',
                                onClick: (event, rowData) => {
                                    console.log(event, rowData);
                                }
                            },
                            {
                                icon: () => <ArrowDropDown style={{ fontSize: '24px', color: '#666' }} />,
                                tooltip: 'Move up',
                                onClick: (event, rowData) => {
                                    console.log(event, rowData);
                                }
                            },
                        ]}
                    />
                    <br/>
                    {/* <Button onClick={ handleAddNewRow } size='small'><Add fontSize='small' /></Button> */}
                    <br/><br/>
                    <Button><div>PLAY&nbsp;&nbsp;</div><PlayArrow style={{ color: '#333' }} /></Button>
                </div>
                <br/><br/>
                <div className='section-div section-margin-left'>
                    <div className='section-heading'>CPU Scheduling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='extra-small' style={{ fontFamily: 'Montserrat', textTransform: 'none' }}>t = x</span></div>
                </div>
            </div>
            <Drawer anchor='right' content={
                <div>
                    <br/><br/>
                    <div><Switch checked={ ioBoundState } onChange={ handleSwitchChange } label='I/O Bound' /></div>
                    <br/>
                    <div className='iotimes-div margin-top-20' style={{ display: ioBoundState ? 'block' : 'none' }}>
                        <InputFieldWithLabel value='2' type='number' onChange={ () => {} } label='I/O Times' />
                    </div>
                    <br/><br/>
                    <div className='full-form-div margin-top-20'>
                        <ul>
                            <li><button><div>P. No. - Process Number &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>AT - Arrival Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>BT - Burst Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>IOBT - I/O Burst Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>CT - Completion Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>TAT - Turn Around Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>WT - Waiting Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                            <li><button><div>RT - Response Time &nbsp;</div><HelpOutline className='help-icon' /></button></li>
                        </ul>
                    </div>
                    <br/><br/><br/><br/>
                    <div className='margin-10'>
                        <Button size='small' style={{ float: 'none' }}>
                            <div>View Time Log</div> &nbsp;&nbsp;&nbsp;<History fontSize='small' />
                        </Button>
                    </div>
                </div>
            } />
        </div>
    );
}

export default Algo;