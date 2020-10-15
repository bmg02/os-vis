import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles, IconButton } from '@material-ui/core';
import { InputField } from './InputField';
import { Close } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
    tablePaperRoot: {
        borderRadius: '0px',
        maxWidth: '1000px',
        boxShadow: 'none',
    },
    headerRoot: {
        background: '#DCDCDC',
    },
    headerCell: {
        fontFamily: 'Montserrat-Bold',
        minWidth: '70px',
        maxWidth: '110px',
        padding: '7px !important',
        background: '#DCDCDC',
    },
    tableCell: {
        textAlign: 'center',
        padding: '0px',
        border: '1px solid #DCDCDC',
        maxWidth: '100px',
        minWidth: '80px'
    },
    actionTableCell: {
        paddingLeft: '20px',
        textAlign: 'center',
        padding: '7px',
        border: 'none'
    }
}));

function TableLayout(props) {

    const { rowValueState, setRowValueState } = props;
    const classes = useStyle();

    const columnState = React.useRef({
        atime: 'AT',
        btime: 'BT',
        ctime: 'CT',
        tatime: 'TAT',
        wtime: 'WT',
        rtime: 'RT'
    });

    const createData = () => {
        let obj = {};
        let columnArr = Object.keys(columnState.current);
        for (let col in columnArr) {
            if (columnArr[col] === 'ioTimes') continue;
            else {
                // if (columnArr[col] === 'btime') obj[columnArr[col]] = '1';
                // else obj[columnArr[col]] = '';
                obj[columnArr[col]] = '';
            }
        }
        obj['ioTimes'] = '0';
        return obj;
    }

    // const [ rowValueState, setRowValueState ] = React.useState({ value: [ createData(columnState.current, 1) ] });

    const checkForEmptyCells = (rowKey) => {
        let rowArr = Object.keys(rowValueState.value[rowKey]);
        for (let r in rowArr) {
            if (rowValueState.value[rowKey][rowArr[r]] !== '') {
                let data = rowValueState.value;
                data.push(createData());
                break;
            }
        }
    }

    const checkForLastEmptyRow = () => {
        let lastRowIndex = rowValueState.value.length - 1;
        let rowArr = Object.keys(rowValueState.value[lastRowIndex]);
        console.log(rowArr);
        for (let r in rowArr) {
            if (rowArr[r] === 'ioTimes') continue;
            if (rowValueState.value[lastRowIndex][rowArr[r]] !== '') {
                return true;
            }
        }
        return false;
    }

    const handleValueChange = (e, rowKey, colItem, eleIndex = null) => {
        let data = rowValueState.value;
        let val = e.target.value;
        console.log(val);
        if (colItem !== 'atime' && (val < 1 || val >= 5000)) val = 1;
        console.log(val);
        if (colItem === 'ioTimes') {
            if (val < 0 || val > 10) val = 0;
            data[rowKey][colItem] = parseInt(val);
            for (let i = 1; i < parseInt(val); i++) {
                data[rowKey]['iobtime' + i] = '';
                data[rowKey]['btime' + i] = '';
            }
        }
        else if (eleIndex !== null && (colItem === 'btime' || colItem === 'iobtime')) {
            console.log('here');
            data[rowKey][colItem + eleIndex] = val;
        }
        else data[rowKey][colItem] = val;
        setRowValueState({ value: data });
        if (colItem !== 'ioTimes' && rowValueState.value.length < 50) if (checkForLastEmptyRow()) checkForEmptyCells(rowKey);
    }

    const getArr = (size) => {
        let arr = [];
        for (let i = 0; i < parseInt(size); i++) {
            arr.push('');
        }
        return arr;
    }

    const removeRow = (rowKey) => {
        if (rowValueState.value.length > 1) {
            let data = rowValueState.value;
            data.splice(rowKey, 1);
            setRowValueState({ value: data });
        }
    }

    React.useEffect(() => {
        setRowValueState({ value: [ createData() ] });
    }, []);

    // React.useEffect(() => {
    //     if (props.ioTimes > 0) {
    //         let data = [];

    //         // Iterate through each row
    //         for (let i in rowValueState.value) {

    //             // Object key array for each row
    //             let rowArr = Object.keys(rowValueState.value[i]);
    //             data[i] = rowValueState.value[i];

    //             // Check of row field exist or not for iobt columns
    //             for (let j = 1; j <= props.ioTimes; j++) {
    //                 if (rowArr.findIndex(a => { return a === 'btime' + j }) !== -1) continue;
    //                 data[i]['iobtime' + j] = '';
    //                 data[i]['btime' + j] = '';
    //             }
    //         }

    //         console.log(data);
    //         setRowValueState({ value: data });
    //     }
    // }, [props.ioTimes]);

    // React.useEffect(() => {
    //     console.log(props.ioBound);
    // }, [props.ioBound]);

    return (
        <TableContainer component={ Paper } classes={{ root: classes.tablePaperRoot }}>
            <Table>
                <TableHead classes={{ root: classes.headerRoot }}>
                    <TableRow>
                        {
                            props.ioBound ?
                                <TableCell key={ 'iotimes' } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>I/O Times</TableCell>
                            :
                                <TableCell style={{ display: 'none' }}></TableCell>

                        }
                        <TableCell key={ 'header-pno' } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>P. No.</TableCell>
                        {
                            Object.keys(columnState.current).map((item) => {
                                let ioCells = [];
                                // if (item === 'ctime') {
                                //     for (let i = 1; i <= props.ioTimes; i++) {
                                //         ioCells.push(<TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>IOBT</TableCell>, <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>BT</TableCell>);
                                //     }
                                // }
                                ioCells.push(<TableCell key={ 'header-' + item } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>{ columnState.current[item] }</TableCell>);
                                return ioCells;
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rowValueState.value.map((rowItem, rowKey) => {
                            return (
                                <TableRow key={ 'row-' + rowKey }>
                                    {
                                        props.ioBound ?
                                            <TableCell key={ 'rowcell-iotimes-' + rowKey } classes={{ root: classes.tableCell }}>
                                                <InputField type='number' value={ rowValueState.value[rowKey]['ioTimes'] } border='none' key={ 'inp-' + rowKey + '-0' } id={ 'inp-' + rowKey + '-0' } onChange={ (e) => handleValueChange(e, rowKey, 'ioTimes') } min='0' max='10' />
                                            </TableCell>
                                        :
                                            <TableCell style={{ display: 'none' }}></TableCell>
                                    }
                                    <TableCell key={ 'rowcell-pno-' + rowKey } classes={{ root: classes.tableCell }}>
                                        <InputField type='number' value={ rowKey } border='none' key={ 'inp-' + rowKey + '-0' } id={ 'inp-' + rowKey + '-0' } min='0' readOnly={ true } />
                                    </TableCell>
                                    {
                                        Object.keys(columnState.current).map(colItem => {
                                            let rowCells = [];
                                            // if (colItem === 'ctime') {
                                            //     for (let i = 1; i <= props.ioTimes; i++) {
                                            //         rowCells.push(
                                            //             <TableCell key={ 'iobtime' + i } variant='head' classes={{ root: classes.tableCell }}>
                                            //                 <InputField type='number' onChange={ (e) => handleValueChange(e, rowKey, 'iobtime' + i) } value={ rowItem['iobtime' + i] } border='none' key={ 'inp-' + colItem + rowKey } id={ 'inp-' + rowKey + '-0' } min='1' max='5000' />
                                            //             </TableCell>,
                                            //             <TableCell key={ 'btime' + i } variant='head' classes={{ root: classes.tableCell }}>
                                            //                 <InputField type='number' onChange={ (e) => handleValueChange(e, rowKey, 'btime' + i) } border='none' value={ rowItem['btime' + i] } key={ 'inp-' + colItem + rowKey } id={ 'inp-' + rowKey + '-0' } min='1' max='5000' />
                                            //             </TableCell>
                                            //         );
                                            //     }
                                            // }
                                            rowCells.push(
                                                <TableCell key={ 'cell-' + colItem + '-' + rowKey } classes={{ root: classes.tableCell }} style={{ maxWidth: 'max-content' }}>
                                                    {
                                                        colItem === 'btime' && props.ioBound && parseInt(rowValueState.value[rowKey]['ioTimes']) > 0 ?
                                                            <Table>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell key={ 'rowcell-btime-' + rowKey + '' } variant='head' classes={{ root: classes.tableCell }} style={{ maxWidth: '100%', width: '100px', border: 'none', fontSize: '12px'}}>
                                                                            <InputField type='number' value={ rowItem['btime0'] } onChange={ (e) => handleValueChange(e, rowKey, 'btime', 0) } key={ 'inp-btime-' + rowKey + '-0' } border='none' placeholder='BT' id={ 'inp-btime-' + rowKey + '-0' } min='1' max='5000' />
                                                                        </TableCell>
                                                                        {
                                                                            getArr(rowValueState.value[rowKey]['ioTimes']).map((ele, eleIndex) => {
                                                                                return (
                                                                                    <React.Fragment key={(eleIndex + 1)}>
                                                                                        <TableCell key={ 'rowcell-iobtime-' + rowKey + '-' + (eleIndex + 1) } variant='head' classes={{ root: classes.tableCell }} style={{ maxWidth: '100%', width: '100px', border: 'none', fontSize: '12px', marginLeft: (eleIndex + 1) === 0 ? '' : '5px' }}>
                                                                                            <InputField type='number' value={ rowItem['iobtime' + (eleIndex + 1)] } onChange={ (e) => handleValueChange(e, rowKey, 'iobtime', (eleIndex + 1)) } key={ 'inp-iobtime-' + rowKey + '-' + (eleIndex + 1) } border='none' placeholder='IOBT' id={ 'inp-iobtime-' + rowKey + '-' + (eleIndex + 1) } min='1' max='5000' />
                                                                                        </TableCell>
                                                                                        <TableCell key={ 'rowcell-btime-' + rowKey + '-' + (eleIndex + 1) } variant='head' classes={{ root: classes.tableCell }} style={{ maxWidth: '100%', width: '100px', border: 'none', fontSize: '12px' }}>
                                                                                            <InputField type='number' value={ rowItem['btime' + (eleIndex + 1)] } onChange={ (e) => handleValueChange(e, rowKey, 'btime', (eleIndex + 1)) } key={ 'inp-btime-' + rowKey + '-' + (eleIndex + 1) } border='none' placeholder='BT' id={ 'inp-btime-' + rowKey + '-' + (eleIndex + 1) } min='1' max='5000' />
                                                                                        </TableCell>
                                                                                    </React.Fragment>
                                                                                )
                                                                            })
                                                                        }
                                                                    </TableRow>
                                                                    {/* <TableRow>
                                                                        <TableCell key={ 'cell-' + colItem + '-' + rowKey } classes={{ root: classes.tableCell }} style={{ border: 'none' }}>
                                                                            <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e, rowKey, colItem) } key={ 'inp-' + colItem + '-' + rowKey } border='none' id={ 'inp-' + colItem + '-' + rowKey } min={ colItem === 'btime' ? '1' : '0' } max='5000' />
                                                                        </TableCell>
                                                                        <TableCell key={ 'cell-' + colItem + '-' + rowKey } classes={{ root: classes.tableCell }} style={{ border: 'none' }}>
                                                                            <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e, rowKey, colItem) } key={ 'inp-' + colItem + '-' + rowKey } border='none' id={ 'inp-' + colItem + '-' + rowKey } min={ colItem === 'btime' ? '1' : '0' } max='5000' />
                                                                        </TableCell>
                                                                    </TableRow> */}
                                                                </TableBody>
                                                            </Table>
                                                        :
                                                            <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e, rowKey, colItem) } key={ 'inp-' + colItem + '-' + rowKey } border='none' id={ 'inp-' + colItem + '-' + rowKey } min={ colItem === 'btime' ? '1' : '0' } readOnly={ colItem !== 'atime' && colItem !== 'btime' ? true : false } max='5000' />
                                                    }
                                                    {/* {
                                                        colItem === 'btime' && props.ioBound ?
                                                            ''
                                                        :
                                                            <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e, rowKey, colItem) } key={ 'inp-' + colItem + '-' + rowKey } border='none' id={ 'inp-' + colItem + '-' + rowKey } min={ colItem === 'btime' ? '1' : '0' } max='5000' />
                                                    } */}
                                                </TableCell>
                                            );
                                            return rowCells;
                                        })
                                    }

                                    {/* FOR REMOVE BUTTON */}
                                    <TableCell classes={{ root: classes.actionTableCell }}>
                                        <IconButton style={{ padding: '3px' }} onClick={ () => removeRow(rowKey) } disabled={ rowValueState.value.length < 2 }>
                                            <Close style={{ fontSize: '18px', color: '#D91E2A', opacity: rowValueState.value.length > 1 ? '1' : '0' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableLayout;