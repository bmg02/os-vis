import React from 'react';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';

function Algo(props) {
    return (
        <div className='section-div section-margin-left'>
            <div className='section-heading extra-large'>{props.match.params.algo.replace(/-/g, ' ')}</div>
            <div className='extra-small margin-top-10'><Link to='/'>Change Algorithm</Link></div>
            <br/><br/>
            <MaterialTable
                columns={[
                    { title: 'P. No.', field: 'pno' },
                    { title: 'AT', field: 'atime' },
                    { title: 'BT', field: 'btime' },
                    { title: 'IOBT', field: 'iobtime' },
                    { title: 'BT', field: 'btime' },
                    { title: 'IOBT', field: 'iobtime' },
                    { title: 'BT', field: 'btime' },
                ]}
                data={[{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }]}
                title="Demo Title"
            />
        </div>
    );
}

export default Algo;