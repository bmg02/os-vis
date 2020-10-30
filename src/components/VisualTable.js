import React from 'react';
import { makeStyles, Paper, Table, TableContainer, TableHead, TableRow, TableCell } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
    tableHeading: {
        padding: '10px 0',
        display: 'inline-block'
    },
    tablePaperRoot: {
        borderRadius: '0px',
        boxShadow: 'none',
        display: 'inline-block',
        width: 'max-content',
        margin: '20px',
        verticalAlign: 'top'
    },
    tableRoot: {
        border: '1px solid red',
        width: 'max-content'
    },
    headerRoot: {
        background: '#DCDCDC',
    },
    headerCell: {
        fontFamily: 'Montserrat-Bold',
        minWidth: '70px',
        padding: '7px !important',
        background: '#DCDCDC',
    },
    tableCell: {
        textAlign: 'center',
        padding: '0px',
        border: '1px solid #DCDCDC',
        minWidth: '80px'
    },
}));

function VisualTable(props) {
    
    const classes = useStyle();

    React.useEffect(() => {
        console.log(props.rows);
    }, [props.rows]);

    return (
        <TableContainer component={ Paper } classes={{ root: classes.tablePaperRoot }}>
            <div className={ classes.tableHeading }>{props.name}</div>
            <Table classes={{ root: classes.tableRoot }}>
                <TableHead classes={{ root: classes.headerRoot }}>
                    <TableRow>
                        {
                            props.columns.length > 0 ?
                                props.columns.map((item, key) => {
                                    return <TableCell classes={{ head: classes.headerCell, root: classes.tableCell }} key={props.name + '-col-' + key}>{ item }</TableCell>;
                                })
                            :
                                ''
                        }
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    );
}

export default VisualTable;