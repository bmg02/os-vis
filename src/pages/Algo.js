import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Popover, makeStyles, Snackbar } from '@material-ui/core';
import { Drawer, Switch, Button, TableLayout, VisualTable } from '../components';
import { History, PlayArrow, SettingsSharp } from '@material-ui/icons';
import './Algo.scss';
import '../layouts/wow.css';
import { capitalizeEachWord } from '../util/general';
import { performCalculation } from '../util/algorithms';
import { DialogBox, Dropdown, DropdownMenu } from '../components';

const useStyle = makeStyles(theme => ({
    menuItemRoot: {
        padding: '8px 16px',
        fontSize: '14px'
    },
    avgsDiv: {
        display: 'inline-block',
        margin: '12px 40px',
    }
}));

const cols = ["AT (in Ready State)", "Total CPU BT Left", "Total CPU BT", "Next CPU BT", "Total IOBT", "Next Left CPU BT", "P. No.", "AT (First AT)", "Total (CPU+IO) BT Left", "Priority"];

function Algo(props) {

    const classes = useStyle();

    const [ ioBoundState, setIoBoundState ] = React.useState(false);


    const [ tableAnimeValueState, setTableAnimeValueState ] = React.useState({
        notArrived: [[]],
        ready: [[]],
        running: [[]],
        waiting: [[]],
        ioProcess: [[]],
        avgTat: '',
        avgWt: '',
        avgRt: '',
        cpuUtil: '',
        throughput: ''
    });

    const priorityList = React.useRef({});

    const [ timeState, setTimeState ] = React.useState('');

    const [ dialogState, setDialogState ] = React.useState(false);

    const handleDialogOpen = () => setDialogState(true);
    const handleDialogClose = () => setDialogState(false);

    const [ tableValueState, setTableValueState ] = React.useState({ value: [] });

    const handleSwitchChange = (e) => {
        setIoBoundState(e.target.checked);
    }

    const [ changeAlgoState, setChangeAlgoState ] = React.useState(null);
    const handleAlgoOpen = (e) => {
        setChangeAlgoState(e.currentTarget);
    }

    const [ priorityState, setPriorityState ] = React.useState({
        dropdown0: 0,
        dropdown1: 0,
        dropdown2: 0
    });

    const [ priorityErrState, setPriorityErrState ] = React.useState(false);
    const handlePriorityErrChange = () => {
        setPriorityErrState(!priorityErrState);
    }

    const [ showDropDown2State, setShowDropDown2State ] = React.useState('none');

    const handlePriorityChange = (id, index) => {
        
        if (id === 'dropdown1' && index === 0) setShowDropDown2State('none');
        
        for (let i = 0; i < 3; i++) {
            if (id.indexOf(i) === -1) {
                if ((id === 'dropdown1' && index !== 0) || id !== 'dropdown1') {
                    if (priorityList.current[id][index] === priorityList.current['dropdown' + i][priorityState['dropdown' + i]]) {
                        handlePriorityErrChange();
                        return;
                    }
                }
            }
        }
        if (id === 'dropdown1' && index !== 0) setShowDropDown2State('block');

        else if (id !== 'dropdown2') setShowDropDown2State('none');

        setPriorityState({ ...priorityState, [id]: index });
    }

    const getVisualAnimation = () => {
        document.getElementById('visualAnimeDiv').style.display = 'inline-block';
        performCalculation(tableValueState, setTableValueState, tableAnimeValueState, setTableAnimeValueState, setTimeState);
    }

    React.useEffect(() => {
        document.title = capitalizeEachWord(props.match.params.algo.replace(/-/g, ' ')) + ' at OS-VIS';

        if (props.match.params.algo === 'first-come-first-serve') {
            priorityList.current = {
                dropdown0: [ cols[0], cols[7] ],
                dropdown1: [ cols[6], cols[0], cols[7] ],
                dropdown2: [ cols[6] ],
            };
        }
        else if (props.match.params.algo === 'shortest-job-first' || props.match.params.algo === 'shortest-remaining-time-first') {
            priorityList.current = {
                dropdown0: [ cols[1], cols[3], cols[8] ],
                dropdown1: [ cols[6], cols[0], cols[7] ],
                dropdown2: [ cols[6], cols[0], cols[7] ],
                dropdown3: [ cols[6] ],
            };
        }
        else if (props.match.params.algo === 'longest-job-first' || props.match.params.algo === 'longest-remaining-time-first') {
            priorityList.current = {
                dropdown0: [ cols[1], cols[3], cols[8] ],
                dropdown1: [ cols[6], cols[0], cols[7] ],
                dropdown2: [ cols[6], cols[0], cols[7] ],
                dropdown3: [ cols[6] ],
            };
        }
        else if (props.match.params.algo === 'priority-scheduling') {
            priorityList.current = {
                dropdown0: [ cols[9] ],
                dropdown1: [ cols[6], cols[0], cols[7] ],
                dropdown2: [ cols[6], cols[0], cols[7] ],
                dropdown3: [ cols[6] ],
            };
        }
    }, []);


    return (
        <div style={{ display: 'flex' }}>
            <Snackbar open={ priorityErrState } onClose={ handlePriorityErrChange } message='Priority must not be same.' />
            <Drawer anchor='left' content={
                <div>
                    <div className='section-heading extra-large margin-20'>{ props.match.params.algo.replace(/-/g, ' ') }</div>
                    <div className='extra-small margin-20' style={{ alignSelf: 'baseline' }}><Link onClick={ handleAlgoOpen }>Change Algorithm</Link></div>

                    <Dropdown open={ changeAlgoState } links={ true } menuList={[
                        { name: 'First Come First Serve', link: 'first-come-first-serve' },
                        { name: 'Priority Scheduling', link: 'priority-scheduling' },
                        { name: 'Longest Job First', link: 'longest-job-first' },
                        { name: 'Longest Remaining Time First', link: 'longest-remaining-time-first' },
                        { name: 'Round Robin', link: 'round-robin' },
                        { name: 'Shortest Job First', link: 'shortest-job-first' },
                        { name: 'Shortest Remaining Time First', link: 'shortest-remaining-time-first' },
                    ]} />
                    
                    <br/><br/>
                    <div><Switch checked={ ioBoundState } onChange={ handleSwitchChange } label='I/O Bound' /></div>
                    <br/>
                    <div><Switch checked={ ioBoundState } onChange={ handleSwitchChange } label='Preemptive' /></div>
                    <br/>
                    <div><Switch checked={ ioBoundState } onChange={ handleSwitchChange } label='Indexing 0/1' /></div>
                    <br/>
                    <br/>
                    {/* <div className='full-form-div margin-top-20'>
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
                    </div> */}
                    <br/><br/>
                    <div className='margin-10'>
                        <Button size='small' style={{ float: 'none' }}>
                            <div>View Time Log</div> &nbsp;&nbsp;&nbsp;<History fontSize='small' />
                        </Button>
                    </div>
                    <div className='margin-10'>
                        <Button size='small' style={{ float: 'none' }} onClick={ handleDialogOpen }>
                            <div>Priority Settings</div> &nbsp;&nbsp;&nbsp;<SettingsSharp fontSize='small' />
                        </Button>
                    </div>
                </div>
            } />
            <div style={{ width: '100%' }}>
                <br/>
                <div className='section-div section-margin-left'>
                    <center>
                    <div style={{ width: 'max-content' }}>
                        <TableLayout ioBound={ ioBoundState } rowValueState={ tableValueState } setRowValueState={ setTableValueState }  />
                        <br/>
                        <br/><br/>
                        <Button classnames='float-right' onClick={ getVisualAnimation }>PLAY&nbsp;&nbsp;<PlayArrow style={{ color: '#333' }} /></Button>
                        <div style={{ clear: 'both' }}></div>
                        <br/><br/>
                        <div style={{ display: tableAnimeValueState.avgTat !== '' ? 'block' : 'none' }}>
                            <div className={ classes.avgsDiv }>Avg. TAT: { parseFloat(tableAnimeValueState.avgTat).toFixed(3) }</div>
                            <div className={ classes.avgsDiv }>Avg. WT: { parseFloat(tableAnimeValueState.avgWt).toFixed(3) }</div>
                            <div className={ classes.avgsDiv }>Avg. RT: { parseFloat(tableAnimeValueState.avgRt).toFixed(3) }</div>
                            <br/>
                            <div className={ classes.avgsDiv }>CPU Utilization: { parseFloat(tableAnimeValueState.cpuUtil).toFixed(3) }</div>
                            <div className={ classes.avgsDiv }>Throughput: { parseFloat(tableAnimeValueState.throughput).toFixed(3) }</div>
                        </div>
                        <div className='section-div'>
                            <div className='section-heading text-left' style={{ float: 'left' }}>
                                CPU Scheduling
                            </div>
                            {
                                timeState !== '' ?
                                    <div style={{ float: 'right', fontFamily: 'Montserrat-Bold', fontSize: '14px' }}>Time: {timeState}</div>
                                :
                                    ''
                            }
                        </div>
                        <br/><br/>
                        
                        <div id='visualAnimeDiv'>
                            <table id="not-arrived" class="content-table">
                                <caption> Not Arrived </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>AT</th>
                                </tr>
                            </table>


                            <table id="ready" class="content-table">
                                <caption> Ready </caption>
                            </table>

                            <table id="running" class="content-table">
                                <caption> Running </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>Entered At</th>
                                    <th>Will Leave At</th>
                                </tr>
                            </table>


                            <table id="terminated" class="content-table">
                                <caption> Terminated </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>Terminated At</th>
                                </tr>
                            </table>


                            <table id="io" class="content-table">
                                <caption> IO/Blocked </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>Entered At</th>
                                    <th>Will Leave At</th>
                                </tr>
                            </table>
                            {/* <VisualTable name='Not arrived' columns={['P. No.', 'AT']} rows={ tableAnimeValueState.notArrived } />
                            <VisualTable name='Ready' columns={[ 'P. No.', 'AT' ]} rows={ tableAnimeValueState.ready } />
                            <VisualTable name='Running' columns={[ 'P. No.', 'Entered at', 'Leave at' ]} rows={ tableAnimeValueState.running } />
                            <VisualTable name='Terminated' columns={[ 'P. No.', 'Terminated at' ]} rows={ tableAnimeValueState.terminated } />
                            <VisualTable name='I/O Process' columns={[ 'P. No.', 'Entered at', 'Leave at' ]} rows={ tableAnimeValueState.ioProcess } /> */}
                        </div>
                        <h3 id="time" style={{ 'margin-top': '15px' }}> t = -1</h3>
                        <div style={{ 'margin-top': '60px' }}>
                            <div> Time Log: </div>
                            <br/>
                            <div id="txt"> </div>
                        </div>
                    </div>
                    </center>
                </div>
            </div>
            <DialogBox open={ dialogState } onClose={ handleDialogClose } title='Priority Settings' content={
                <div>
                    <DropdownMenu open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown0' label='Priority 1' menuList={ priorityList.current['dropdown0'] } />
                    <DropdownMenu open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown1' label='Priority 2' menuList={ priorityList.current['dropdown1'] } />
                    <DropdownMenu display={ showDropDown2State } open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown2' label='Priority 3' menuList={ priorityList.current['dropdown2'] } />
                </div>
            } />
        </div>
    );
}

export default Algo;