import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles, IconButton } from '@material-ui/core';
import { InputField } from './InputField';
import { Close } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
    tablePaperRoot: {
        borderRadius: '0px',
        maxWidth: '1000px',
        boxShadow: 'none',
        // border: '1px solid #CCC'
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
        // border: '1px solid #DCDCDC'
    }
}));

function TableLayout(props) {

    const classes = useStyle();
    
    const createData = (columns, index) => {
        let obj = {};
        Object.keys(columns).forEach((col, indx) => {
            if (indx === 3) {
                for (let i = 1; i <= props.ioTimes; i++) {
                    obj['btime' + i] = '';
                    obj['iobtime' + i] = '';
                }
            }
            if (col === 'pno') obj[col] = index;
            else obj[col] = '';
        });
        console.log(obj);
        return obj;
    }

    
    // const [ columnState, setColumnState ] = React.useState([
    //     { name: 'P. No.', field: 'pno' },
    //     { name: 'AT', field: 'atime' },
    //     { name: 'BT', field: 'btime' },
    //     { io: [] },
    //     { name: 'CT', field: 'ctime' },
    //     { name: 'TAT', field: 'tatime' },
    //     { name: 'WT', field: 'wtime' },
    //     { name: 'RT', field: 'rtime' },
    // ]);

    const [ columnState, setColumnState ] = React.useState({
        pno: 'P. No.',
        atime: 'AT',
        btime: 'BT',
        ctime: 'CT',
        tatime: 'TAT',
        wtime: 'WT',
        rtime: 'RT'
    });

    const [ ioTimeState, setIoTimeState ] = React.useState('');

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
            if (rowArr[r] !== 'pno' && rowValueState.value[lastRowIndex][rowArr[r]] !== '') {
                return true;
            }
        }
        return false;
    }

    const handleValueChange = (e, rowKey, item) => {
        let data = rowValueState.value;
        data[rowKey][item] = e.target.value;
        setRowValueState({ value: data });
        if (checkForLastEmptyRow()) checkForEmptyCells(rowKey);
    }

    const changeColumns = (ioTimes) => {
        if (ioTimes > 0) {
            // let columns = columnState;

            // let ctimeIndex = columnState.findIndex(a => {
            //     return a['field'] === 'ctime';
            // });

            // let newIndecies = [];

            // for (let i = 1; i <= props.ioTimes; i++) {
            //     newIndecies.push({ name: 'IOBT', field: 'iobtime' + i }, { name: 'BT', field: 'btime' + i });
            // }

            // setColumnState({ ...columnState,  });
            // console.log(columns);
        }
    }

    React.useEffect(() => {
        changeColumns(props.ioTimes);
        console.log(props.ioTimes);
    }, [props.ioTimes]);

    return (
        <TableContainer component={ Paper } classes={{ root: classes.tablePaperRoot }}>
            <Table>
                <TableHead classes={{ root: classes.headerRoot }}>
                    <TableRow>
                        {
                            Object.keys(columnState).map((item, key) => {
                                // if (item !== 'ioTimes') return <TableCell key={ item } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>{ columnState[item] }</TableCell>
                                // else {
                                //     if (columnState[item] > 0) {
                                //         let ioCells = [];
                                //         for (let i = 1; i <= columnState[item]; i++) {
                                //             ioCells.push(<TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>IOBT</TableCell>, <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>BT</TableCell>);
                                //         }
                                //         return ioCells;
                                //     }
                                //     else return '';
                                // }
                                let ioCells = [];
                                if (key === 3) {
                                    if (props.ioTimes > 0) {
                                        for (let i = 1; i <= props.ioTimes; i++) {
                                            ioCells.push(<TableCell key={ 'iobtime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>IOBT</TableCell>, <TableCell key={ 'btime' + i } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>BT</TableCell>);
                                        }
                                    }
                                }
                                ioCells.push(<TableCell key={ item } variant='head' classes={{ head: classes.headerCell, root: classes.tableCell }}>{ columnState[item] }</TableCell>);
                                return ioCells;
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rowValueState.value.map((row, rowKey) => {
                            // console.log(row);
                            return (
                                <TableRow key={ 'row-' + row.pno }>
                                    {
                                        Object.keys(row).map((item, key) => (
                                            <TableCell key={ 'rowcell-' + row.id + '-' + key } classes={{ root: classes.tableCell }}>
                                                <InputField type='number' value={ row[item] } onChange={ (e) => handleValueChange(e, rowKey, item) } border='none' key={ 'inp-' + row.pno + '-' + key } id={ 'inp-' + row.pno + '-' + key } min='0' readOnly={ item === 'pno' } />
                                            </TableCell>
                                        ))
                                    }
                                    <TableCell classes={{ root: classes.actionTableCell }}>
                                        <IconButton style={{ padding: '3px' }}><Close style={{ fontSize: '18px', color: '#D91E2A' }} /></IconButton>
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