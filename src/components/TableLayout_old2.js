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

    const createData = (columns, index) => {
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
            if (columnArr[col] === 'pno') obj[columnArr[col]] = index;
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
        console.log(columns);
    }
    
    const columns = React.useRef({
        pno: 'P. No.',
        atime: 'AT',
        btime: 'BT',
        ioTimes: 0,
        ctime: 'CT',
        tatime: 'TAT',
        wtime: 'WT',
        rtime: 'RT'
    });

    const [ rowValueState, setRowValueState ] = React.useState({ value: [ createData(columns.current, 1) ] });

    const checkForEmptyCells = (rowKey) => {
        let rowArr = Object.keys(rowValueState.value[rowKey]);
        for (let r in rowArr) {
            if (rowValueState.value[rowKey][rowArr[r]] !== '') {
                let data = rowValueState.value;
                data.push(createData(columns.current, rowValueState.value.length + 1));
                break;
            }
        }
    }

    const checkForLastEmptyRow = () => {
        let lastRowIndex = rowValueState.value.length - 1;
        let rowArr = Object.keys(rowValueState.value[lastRowIndex]);
        for (let r in rowArr) {
            if (rowArr[r] !== 'pno' && rowValueState.value[lastRowIndex][rowArr[r]] !== '') {
                return true;
            }
        }
        return false;
    }

    const handleValueChange = (e, key, item, pno, rowKey) => {
        let data = rowValueState.value;
        console.log(data, key, item);
        data[key][item] = e.target.value;
        setRowValueState({ value: data });
        if (checkForLastEmptyRow()) checkForEmptyCells(key);
        // console.log(document.getElementById('inp-' + pno + '-' + rowKey)).focus();
    }

    React.useEffect(() => {
        if (props.ioTimes > 0) {
            console.log(columns.current);
            for (let i in rowValueState.value) {
                let rowArr = Object.keys(rowValueState.value[i]);
                let cTimeIndex = rowArr.findIndex(a => { return a === 'ctime' });
                for (let j = 1; j <= props.ioTimes; j++) {
                    if (rowArr.findIndex(a => { return a === 'btime' + j }) === -1) {
                        console.log('btime' + j + ' is not exist');
                    }
                }
            }
        }
        return () => { console.log('returned'); }
    }, [props.ioTimes]);

    React.useEffect(() => {
        console.log('column changed');
    }, [columns]);

    return (
        <TableContainer component={ Paper } classes={{ root: classes.tablePaperRoot }}>
            <Table>
                <TableHead classes={{ root: classes.headerRoot }}>
                    <TableRow>
                        {
                            Object.keys(columns.current).map((item, key) => {
                                let ioCells = [];
                                if (item === 'ioTimes') {
                                    // if (columns.current[item] > 0) {
                                        for (let i = 1; i <= props.ioTimes; i++) {
                                            ioCells.push(<TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>IOBT</TableCell>, <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>BT</TableCell>);
                                        }
                                    // }
                                }
                                else {
                                    ioCells.push(<TableCell key={ item } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>{ columns.current[item] }</TableCell>);
                                }
                                return ioCells;
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rowValueState.value.map((row, key) => {
                            return (
                                <TableRow key={ 'row-' + row.pno }>
                                    {
                                        Object.keys(row).map((rowItem, rowKey) => (
                                            <TableCell key={ 'rowcell-' + row[rowItem] + '-' + rowKey } classes={{ root: classes.tableCell }}>
                                                <InputField type='number' value={ row[rowItem] } onChange={ (e) => handleValueChange(e, key, rowItem, row.pno, rowKey) } border='none' key={ 'inp-' + row.pno + '-' + rowKey } id={ 'inp-' + row.pno + '-' + rowKey } min='0' readOnly={ rowItem === 'pno' } />
                                            </TableCell>
                                        ))
                                    }
                                    <TableCell classes={{ root: classes.actionTableCell }}>
                                        <IconButton style={{ padding: '3px' }}><Close style={{ fontSize: '18px', color: '#D91E2A' }} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableLayout;