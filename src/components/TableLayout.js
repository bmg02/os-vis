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
        minWidth: '60px',
        maxWidth: '90px'
    },
    tableCell: {
        textAlign: 'center',
        padding: '7px',
        border: '1px solid #DCDCDC',
        maxWidth: '100px'
    },
    actionTableCell: {
        paddingLeft: '20px',
        textAlign: 'center',
        padding: '7px',
        border: 'none'
    }
}));

function TableLayout(props) {

    const classes = useStyle();

    const createData = (columns, rows) => {
        let obj = {};
        let columnArr = Object.keys(columns);
        for (let col in columnArr) {
            // if (columnArr[col] === 'ioTimes') {
            //     for (let i = 1; i <= props.ioTimes; i++) {
            //         obj['iobtime' + i] = '';
            //         obj['btime' + i] = '';
            //     }
            //     continue;
            // }
            if (columnArr[col] === 'ioTimes') continue;
            // if (columnArr[col] === 'pno') obj[columnArr[col]] = rows.length;
            else obj[columnArr[col]] = '';
        }
        return obj;
    }

    const updateData = (columns) => {
        columns = {
            ...columns,
            ioTimes: props.ioTimes
        }
        // let rowArr = Object.keys(columns)
        //console.log(columns);
    }
    
    const [ columnState, setColumnState ] = React.useState({
        // pno: 'P. No.',
        atime: 'AT',
        btime: 'BT',
        ctime: 'CT',
        tatime: 'TAT',
        wtime: 'WT',
        rtime: 'RT'
    });

    const [ rowValueState, setRowValueState ] = React.useState({ value: [ createData(columnState, 1) ] });

    const checkForEmptyCells = (rowKey) => {
        let rowArr = Object.keys(rowValueState.value[rowKey]);
        for (let r in rowArr) {
            if (rowValueState.value[rowKey][rowArr[r]] !== '') {
                let data = rowValueState.value;
                data.push(createData(columnState, rowValueState.value.length + 1));
                break;
            }
        }
    }

    const checkForLastEmptyRow = () => {
        let lastRowIndex = rowValueState.value.length - 1;
        let rowArr = Object.keys(rowValueState.value[lastRowIndex]);
        for (let r in rowArr) {
            if (rowValueState.value[lastRowIndex][rowArr[r]] !== '') {
                return true;
            }
        }
        return false;
    }

    const handleValueChange = (e, key, item, pno, rowKey) => {
        let data = rowValueState.value;
        //console.log(data, key, item);
        data[key][item] = e.target.value;
        setRowValueState({ value: data });
        if (checkForLastEmptyRow()) checkForEmptyCells(key);
        // console.log(document.getElementById('inp-' + pno + '-' + rowKey)).focus();
    }

    const removeRow = (rowKey) => {
        let data = rowValueState.value;
        data.splice(rowKey, 1);
        setRowValueState({ value: data });
        // rowValueState.value.splice(rowKey, 1);
    }

    React.useEffect(() => {
        if (props.ioTimes > 0) {
            let data = [];

            // Iterate through each row
            for (let i in rowValueState.value) {

                // Object key array for each row
                let rowArr = Object.keys(rowValueState.value[i]);
                data[i] = rowValueState.value[i];

                let bTimeIndex = rowArr.findIndex(a => { return a === 'btime' });

                // Check of row field exist or not for iobt columns
                let ioCells = [];
                for (let j = 1; j <= props.ioTimes; j++) {
                    if (rowArr.findIndex(a => { return a === 'btime' + j }) !== -1) continue;
                    data[i]['iobtime' + j] = '';
                    data[i]['btime' + j] = '';
                    // ioCells.push({ [  ]: '' }, { [ 'btime' + j ]: '' });
                }
            }

            console.log(data);
            setRowValueState({ value: data });
        }
        // return () => { console.log('returned'); }
    }, [props.ioTimes]);

    return (
        <TableContainer component={ Paper } classes={{ root: classes.tablePaperRoot }}>
            <Table>
                <TableHead classes={{ root: classes.headerRoot }}>
                    <TableRow>
                        <TableCell key='pno' variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>P. No.</TableCell>
                        {
                            Object.keys(columnState).map((item) => {
                                let ioCells = [];
                                // console.log(item);
                                if (item === 'ctime') {
                                    // if (columns.current[item] > 0) {
                                        for (let i = 1; i <= props.ioTimes; i++) {
                                            ioCells.push(<TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>IOBT</TableCell>, <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>BT</TableCell>);
                                        }
                                    // }
                                }
                                ioCells.push(<TableCell key={ item } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>{ columnState[item] }</TableCell>);
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
                                    <TableCell key={ 'rowcell-' + rowKey + '-0' } classes={{ root: classes.tableCell }}>
                                        <InputField type='number' value={ rowKey + 1 } border='none' key={ 'inp-' + rowKey + '-0' } id={ 'inp-' + rowKey + '-0' } min='0' readOnly={ true } />
                                    </TableCell>
                                    {
                                        Object.keys(columnState).map(colItem => {
                                            let rowCells = [];
                                            console.log(colItem, rowItem);
                                            if (colItem === 'ctime') {
                                                for (let i = 1; i <= props.ioTimes; i++) {
                                                    rowCells.push(
                                                        <TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>
                                                            <InputField type='number' value={ rowItem[ 'iobtime' + i ] } key={ 'inp-' + colItem + rowKey } id={ 'inp-' + rowKey + '-0' } min='0' />
                                                        </TableCell>,
                                                        <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>
                                                            <InputField type='number' value={ 'btime' + i } key={ 'inp-' + colItem + rowKey } id={ 'inp-' + rowKey + '-0' } min='0' />
                                                        </TableCell>
                                                    );
                                                }
                                            }
                                            rowCells.push(
                                                <TableCell key={ 'cell-' + colItem + '-' + rowKey }>
                                                    <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e) } key={ 'inp-' + colItem + '-' + rowKey } id={ 'inp-' + colItem + '-' + rowKey } min='0' />
                                                </TableCell>
                                            );
                                            return rowCells;
                                        })
                                    }
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

// Object.keys(columnState).map(colItem => {
//     let rowCells = [];
//     if (colItem === 'ctime') {
//         for (let i = 1; i <= props.ioTimes; i++) {
//             rowCells.push(
//                 <TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>
//                     <InputField type='number' value={ rowItem[colItem] } border='none' key={ 'inp-' + rowKey + '-0' } id={ 'inp-' + rowKey + '-0' } min='0' readOnly={ true } />
//                 </TableCell>,
//                 <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>
//                     <InputField type='number' value={ rowItem[colItem] } border='none' key={ 'inp-' + rowKey + '-0' } id={ 'inp-' + rowKey + '-0' } min='0' readOnly={ true } />
//                 </TableCell>
//             );
//         }
//     }
//     rowCells.push(
//         <TableCell key={ 'cell-' + colItem + '-' + rowKey }>
//             <InputField type='number' value={ rowItem[colItem] } onChange={ (e) => handleValueChange(e) } key={ 'inp-' + colItem + '-' + rowKey } id={ 'inp-' + colItem + '-' + rowKey } min='0' />
//         </TableCell>
//     );
//     return rowCells;
// })


// return (
//     <TableRow key={ 'row-' + key }>
//         <TableCell key={ 'rowcell-' + key + '-0' } classes={{ root: classes.tableCell }}>
//             <InputField type='number' value={ key + 1 } border='none' key={ 'inp-' + key + '-0' } id={ 'inp-' + key + '-0' } min='0' readOnly={ true } />
//         </TableCell>
//         {
//             Object.keys(row).map((rowItem, rowKey) => (
//                 <TableCell key={ 'rowcell-' + row[rowItem] + '-' + (rowKey + 1) } classes={{ root: classes.tableCell }}>
//                     <InputField type='number' value={ row[rowItem] } onChange={ (e) => handleValueChange(e, key, rowItem, row.pno, (rowKey + 1)) } border='none' key={ 'inp-' + row.pno + '-' + (rowKey + 1) } id={ 'inp-' + row.pno + '-' + (rowKey + 1) } min='0' />
//                 </TableCell>
//             ))
//         }
//         <TableCell classes={{ root: classes.actionTableCell }}>
//             <IconButton style={{ padding: '3px' }} onClick={ () => removeRow(key) }><Close style={{ fontSize: '18px', color: '#D91E2A' }} /></IconButton>
//         </TableCell>
//     </TableRow>
// );