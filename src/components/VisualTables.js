import React from 'react';

function VisualTables(props) {
    return (
        <React.Fragment>
            <div id="main" style={{ display: 'flex' }}>
                <table id="not-arrived" className="content-table">
                    <caption className='title' style={{ margin: '10px 0', color: '#555' }}> Not Arrived </caption>
                    <tr>
                        <th>P. No.</th>
                        <th>AT</th>
                    </tr>
                </table>

                <i id="a1" style={{ marginTop: '70px', fontSize: '60px', marginLeft: '40px', marginRight: '40px', color: '#5c5c5c' }} className="fas fa-long-arrow-alt-right"></i>

                <table id="ready" className="content-table">
                    <caption className='title' style={{ margin: '10px 0', color: '#555' }}> Ready </caption>
                </table>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <i id="a2" style={{ marginTop: '70px', fontSize: '60px', marginLeft: '40px', marginRight: '40px', color: '#5c5c5c' }} className="fas fa-long-arrow-alt-right"></i>
                    <i id="a3" style={{ marginTop: '-2px', fontSize: '60px', marginLeft: '40px', marginRight: '40px', color: '#5c5c5c' }} className="fas fa-long-arrow-alt-left"></i>
                </div>

                <table id="running" className="content-table">
                    <caption className='title' style={{ margin: '10px 0', color: '#555' }}> Running </caption>
                    <tr>
                        <th>P. No.</th>
                        <th>Entered At</th>
                        <th>Will Leave At</th>
                    </tr>
                </table>

                <i id="a4" style={{ marginTop: '70px', fontSize: '60px', marginLeft: '40px', marginRight: '40px', color: '#5c5c5c' }} className="fas fa-long-arrow-alt-right"></i>

                <table id="terminated" className="content-table">
                    <caption className='title' style={{ margin: '10px 0', color: '#555' }}> Terminated </caption>
                    <tr>
                        <th>P. No.</th>
                        <th>Terminated At</th>
                    </tr>
                </table>

            </div>
            <div>
                <i id="a5" style={{ marginTop:'15px', marginBottom: '0', fontSize: '60px', marginLeft: '120px', color: '#5c5c5c' }} className="fas fa-long-arrow-alt-down"></i>
            </div>
            <div style={{marginLeft: '380px', display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginTop: '-5px', fontSize: '65px' }}>
                <i id="a6" style={{ marginRight: '17px', color: '#5c5c5c', transform: 'rotate(45deg)' }} className="fas fa-long-arrow-alt-left"></i>
            </div>
            <div>
                <table id="io" className="content-table">
                    <caption className='title' style={{ margin: '10px 0', color: '#555' }}> IO/Blocked </caption>
                    <tr>
                        <th>P. No.</th>
                        <th>Entered At</th>
                        <th>Will Leave At</th>
                    </tr>
                </table>
            </div>
        </div>
        </React.Fragment>
    );
}

export default VisualTables;