import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Snackbar } from '@material-ui/core';
import { Drawer, Switch, Button, TableLayout, InputField, VisualTables, DialogBox, Dropdown } from '../components';
import { HistoryRounded, PlayArrow, TimelineRounded, TrendingFlatRounded } from '@material-ui/icons';
import './Algo.scss';
import '../layouts/wow.css';
import { capitalizeEachWord } from '../util/general';
import { performCalculation } from '../util/algorithms';
import { Chart } from 'react-google-charts';

const useStyle = makeStyles(theme => ({
    menuItemRoot: {
        padding: '8px 16px',
        fontSize: '14px'
    },
    avgsDiv: {
        padding: '6px 12px',
        background: '#DCDCDC',
        display: 'inline-block',
        margin: '12px 40px',
    }
}));


function Algo(props) {

    const history = useHistory();

    const classes = useStyle();

    const [ ioBoundState, setIoBoundState ] = React.useState(false);
    const [ preemptiveState, setPreemptiveState ] = React.useState(false);

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

    // const priorityList = React.useRef({});

    const [ timeState, setTimeState ] = React.useState('');

    const [ timeLogDialogState, setTimeLogDialogState ] = React.useState(false);

    const handleTimeLogDialogOpen = () => setTimeLogDialogState(true);
    const handleTimeLogDialogClose = () => setTimeLogDialogState(false);

    const [ timeLogState, setTimeLogState ] = React.useState({ list: [] });

    const [ tableValueState, setTableValueState ] = React.useState({ value: [] });

    // const [ animeState, setAnimeState ] = React.useState(false);

    const initChart = (n) => {
        if (n === 4) {
            return ({
                dataTable: [
                    [
                        { type: 'string', id: 'Position' },
                        { type: 'string', id: 'Process' },
                        { type: 'number', id: 'Start' },
                        { type: 'number', id: 'End' }
                    ]
                ],
                options: {}
            });
        }
        else if (n === 3) {
            return ({
                dataTable: [
                    [
                        { type: 'string', id: 'Process' },
                        { type: 'number', id: 'Start' },
                        { type: 'number', id: 'End' }
                    ]
                ],
                options: {}
            });
        }
    }

    const [ ganttChartState, setGanttChartState ] = React.useState(initChart(4));
    const [ finalGanttChartState, setFinalGanttChartState ] = React.useState(initChart(4));

    const [ timelineChartState, setTimelineChartState ] = React.useState(initChart(3));
    const [ finalTimelineChartState, setFinalTimelineChartState ] = React.useState(initChart(3));

    const handleIOChange = (e) => {
        setIoBoundState(e.target.checked);
    }

    const handlePreemptiveChange = (e) => {
        // console.log(e.target.checked);
        setPreemptiveState(e.target.checked);
        if (e.target.checked) {
            if (props.match.params.algo === 'shortest-job-first') history.push('/scheduling/shortest-remaining-time-first');
            else if (props.match.params.algo === 'longest-job-first') history.push('/scheduling/longest-remaining-time-first');
            else if (props.match.params.algo === 'priority-scheduling-np') history.push('/scheduling/priority-scheduling-p');
        }
        else {
            if (props.match.params.algo === 'shortest-remaining-time-first') history.push('/scheduling/shortest-job-first');
            else if (props.match.params.algo === 'longest-remaining-time-first') history.push('/scheduling/longest-job-first');
            else if (props.match.params.algo === 'priority-scheduling-p') history.push('/scheduling/priority-scheduling-np');
        }
    }

    const [ ganttDialogState, setGanttDialogState ] = React.useState(false);
    const handleGanttDialogOpen = () => setGanttDialogState(true);
    const handleGanttDialogClose = () => setGanttDialogState(false);
    
    const [ timelineDialogState, setTimelineDialogState ] = React.useState(false);
    const handleTimelineDialogOpen = () => setTimelineDialogState(true);
    const handleTimelineDialogClose = () => setTimelineDialogState(false);

    const [ changeAlgoState, setChangeAlgoState ] = React.useState(null);
    const handleAlgoOpen = (e) => {
        setChangeAlgoState(e.currentTarget);
    }
    const handleChangeAlgoClose = (e) => {
        setChangeAlgoState(null);
    }
    const handleOnClickChangeAlgo = (e) => {
        setChangeAlgoState(null);
        let values = [...tableValueState.value];
        for (let i = 0; i < values.length; i++) {
            values[i]['ctime'] = '';
            values[i]['tatime'] = '';
            values[i]['wtime'] = '';
            values[i]['rtime'] = '';
        }
        setTableValueState({ value: values });
        setTableAnimeValueState({
            ...tableAnimeValueState,
            avgTat: '',
            avgWt: '',
            avgRt: '',
            cpuUtil: '',
            throughput: ''
        });
        setTimeState('');
        setGanttChartState(initChart(4));
        setTimelineChartState(initChart(3));
        setTimeLogState({ list: [] });
        setFinalGanttChartState(initChart(4));
        setFinalTimelineChartState(initChart(3));
        // document.getElementById('visualAnimeDiv').remove();
    }

    // const [ priorityState, setPriorityState ] = React.useState({
    //     dropdown0: 0,
    //     dropdown1: 0,
    //     dropdown2: 0
    // });

    // const [ showDropDown2State, setShowDropDown2State ] = React.useState('none');

    // const handlePriorityChange = (id, index) => {
        
    //     if (id === 'dropdown1' && index === 0) setShowDropDown2State('none');
        
    //     for (let i = 0; i < 3; i++) {
    //         if (id.indexOf(i) === -1) {
    //             if ((id === 'dropdown1' && index !== 0) || id !== 'dropdown1') {
    //                 if (priorityList.current[id][index] === priorityList.current['dropdown' + i][priorityState['dropdown' + i]]) {
    //                     handlePriorityErrChange();
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    //     if (id === 'dropdown1' && index !== 0) setShowDropDown2State('block');

    //     else if (id !== 'dropdown2') setShowDropDown2State('none');

    //     setPriorityState({ ...priorityState, [id]: index });
    // }

    const getVisualAnimation = () => {
        // document.getElementById('visualAnimeDiv').remove();
        // console.log('151');
        setTimeState('');
        setGanttChartState(initChart(4));
        setTimelineChartState(initChart(3));
        setTimeLogState({ list: [] });
        setFinalGanttChartState(initChart(4));
        setFinalTimelineChartState(initChart(3));
        document.getElementById('visualAnimeDiv').style.display = 'inline-block';
        performCalculation(props.match.params.algo, tableValueState, setTableValueState, tableAnimeValueState, setTableAnimeValueState, ganttChartState, setGanttChartState, timelineChartState, setTimelineChartState, timeLogState, setTimeLogState, setTimeState, timeQuantumState, setFinalGanttChartState, setFinalTimelineChartState);
        // setTimeout(() => {
        //     console.log(animeState);
        // }, 2000);
    }

    const [ timeQuantumState, setTimeQuantumState ] = React.useState(2);
    const handleTQChange = (e) => {
        setTimeQuantumState(e.target.value);
    }

    React.useEffect(() => {
        document.title = capitalizeEachWord(props.match.params.algo.replace(/-/g, ' ')) + ' at OS-VIS';
        setPreemptiveState(props.match.params.algo === 'round-robin' || props.match.params.algo === 'shortest-remaining-time-first' || props.match.params.algo === 'longest-remaining-time-first' || props.match.params.algo === 'priority-scheduling-p');

    //     if (props.match.params.algo === 'first-come-first-serve') {
    //         priorityList.current = {
    //             dropdown0: [ cols[0], cols[7] ],
    //             dropdown1: [ cols[6], cols[0], cols[7] ],
    //             dropdown2: [ cols[6] ],
    //         };
    //     }
    //     else if (props.match.params.algo === 'shortest-job-first' || props.match.params.algo === 'shortest-remaining-time-first') {
    //         priorityList.current = {
    //             dropdown0: [ cols[1], cols[3], cols[8] ],
    //             dropdown1: [ cols[6], cols[0], cols[7] ],
    //             dropdown2: [ cols[6], cols[0], cols[7] ],
    //             dropdown3: [ cols[6] ],
    //         };
    //     }
    //     else if (props.match.params.algo === 'longest-job-first' || props.match.params.algo === 'longest-remaining-time-first') {
    //         priorityList.current = {
    //             dropdown0: [ cols[1], cols[3], cols[8] ],
    //             dropdown1: [ cols[6], cols[0], cols[7] ],
    //             dropdown2: [ cols[6], cols[0], cols[7] ],
    //             dropdown3: [ cols[6] ],
    //         };
    //     }
    //     else if (props.match.params.algo === 'priority-scheduling') {
    //         priorityList.current = {
    //             dropdown0: [ cols[9] ],
    //             dropdown1: [ cols[6], cols[0], cols[7] ],
    //             dropdown2: [ cols[6], cols[0], cols[7] ],
    //             dropdown3: [ cols[6] ],
    //         };
    //     }
    }, [props.match.params.algo]);


    return (
        <div style={{ display: 'flex' }}>
            {/* <Snackbar open={ priorityErrState } onClose={ handlePriorityErrChange } message='Priority must not be same.' /> */}
            <Drawer anchor='left' content={
                <div>
                    <div className='section-heading extra-large margin-20'>{
                        props.match.params.algo === 'priority-scheduling-np' || props.match.params.algo === 'priority-scheduling-p' ? 'Priority Scheduling' : props.match.params.algo.replace(/-/g, ' ')
                    }</div>
                    <div className='extra-small margin-20' style={{ alignSelf: 'baseline' }}><Button onClick={ handleAlgoOpen } disabled={ timeState !== '' && timeState !== 'Finished' }>Change Algorithm</Button></div>

                    <Dropdown open={ changeAlgoState } handleOnClick={ handleOnClickChangeAlgo } onClose={ handleChangeAlgoClose } links={ true } menuList={[
                        { name: 'First Come First Serve', link: 'first-come-first-serve' },
                        { name: 'Priority Scheduling', link: 'priority-scheduling-np' },
                        { name: 'Longest Job First', link: 'longest-job-first' },
                        { name: 'Longest Remaining Time First', link: 'longest-remaining-time-first' },
                        { name: 'Round Robin', link: 'round-robin' },
                        { name: 'Shortest Job First', link: 'shortest-job-first' },
                        { name: 'Shortest Remaining Time First', link: 'shortest-remaining-time-first' },
                    ]} />
                    
                    <br/><br/>
                    <div><Switch checked={ ioBoundState } onChange={ handleIOChange } disabled={ timeState !== '' && timeState !== 'Finished' } label='I/O Bound' /></div>
                    <br/>
                    <br/>
                    <div><Switch checked={ preemptiveState } onChange={ handlePreemptiveChange } disabled={ (timeState !== '' && timeState !== 'Finished') || (props.match.params.algo === 'first-come-first-serve' || props.match.params.algo === 'round-robin') } label='Preemptive' /></div>
                    <br/><br/>
                    {
                        props.match.params.algo === 'round-robin' ?
                            <React.Fragment><span className='title text-left bold-text' style={{ marginLeft: '16px' }}>Time Quantum: </span><InputField type='number' value={ timeQuantumState } key='time-quantum' id='time-quantam' onChange={ (e) => handleTQChange(e) } min='1' /></React.Fragment>
                        :
                            ''
                    }
                    {/* <div><Switch checked={ ioBoundState } onChange={ handleSwitchChange } label='Indexing 0/1' /></div> */}
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
                        <Button size='small' style={{ float: 'none', display: 'flex', alignItems: 'center' }} onClick={ handleTimeLogDialogOpen }>
                            <div>Time Log</div> &nbsp;&nbsp;&nbsp;<HistoryRounded fontSize='small' />
                        </Button>
                    </div><br/>
                    <div className='margin-10'>
                        <Button size='small' style={{ float: 'none', display: 'flex', alignItems: 'center' }} onClick={ handleGanttDialogOpen }>
                            <div>Gantt Chart</div> &nbsp;&nbsp;&nbsp;<TrendingFlatRounded fontSize='small' />
                        </Button>
                    </div><br/>
                    <div className='margin-10'>
                        <Button size='small' style={{ float: 'none', display: 'flex', alignItems: 'center' }} onClick={ handleTimelineDialogOpen }>
                            <div>Timeline Chart</div> &nbsp;&nbsp;&nbsp;<TimelineRounded fontSize='small' />
                        </Button>
                    </div>
                    {/* <div className='margin-10'>
                        <Button size='small' style={{ float: 'none' }} onClick={ handleDialogOpen }>
                            <div>Priority Settings</div> &nbsp;&nbsp;&nbsp;<SettingsSharp fontSize='small' />
                        </Button>
                    </div> */}
                </div>
            } />
            <div style={{ width: '100%' }}>
                <br/>
                <div className='section-div section-margin-left'>
                    <center>
                    <div style={{ width: 'max-content' }}>
                        <TableLayout algo={ props.match.params.algo } ioBound={ ioBoundState } rowValueState={ tableValueState }  disabled={ timeState !== '' && timeState !== 'Finished' } setRowValueState={ setTableValueState }  />
                        <br/>
                        <br/><br/>
                        <Button classnames='float-right' onClick={ getVisualAnimation } disabled={ timeState !== '' && timeState !== 'Finished' } style={{ display: 'flex', alignItems: 'center' }}><span style={{ margin: '0 5px' }}>PLAY</span><PlayArrow style={{ color: '#333' }} /></Button>
                        <div style={{ clear: 'both' }}></div>
                        <br/><br/>
                        <div style={{ display: tableAnimeValueState.avgTat !== '' ? 'block' : 'none' }}>
                            <div className={ classes.avgsDiv }>Avg. TAT: { parseFloat(tableAnimeValueState.avgTat).toFixed(3) }</div>
                            <div className={ classes.avgsDiv }>Avg. WT: { parseFloat(tableAnimeValueState.avgWt).toFixed(3) }</div>
                            <div className={ classes.avgsDiv }>Avg. RT: { parseFloat(tableAnimeValueState.avgRt).toFixed(3) }</div>
                            <br/>
                            <div className={ classes.avgsDiv }>CPU Utilization: { parseFloat(tableAnimeValueState.cpuUtil).toFixed(3) } %</div>
                            <div className={ classes.avgsDiv }>Throughput: { parseFloat(tableAnimeValueState.throughput).toFixed(3) }</div>
                        </div>
                        <div className='section-div'>
                            <div className='section-heading text-left' style={{ display: timeState !== '' ? "block" : 'none', float: 'left' }}>
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
                        <div id='visualAnimeDiv' style={{ display: timeState !== '' ? "block" : 'none' }}>
                            <VisualTables />
                            {/*<table id="not-arrived" className="content-table">
                                <caption> Not Arrived </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>AT</th>
                                </tr>
                            </table>


                            <table id="ready" className="content-table">
                                <caption> Ready </caption>
                            </table>

                            <table id="running" className="content-table">
                                <caption> Running </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>Entered At</th>
                                    <th>Will Leave At</th>
                                </tr>
                            </table>


                            <table id="terminated" className="content-table">
                                <caption> Terminated </caption>
                                <tr>
                                    <th>P. No.</th>
                                    <th>Terminated At</th>
                                </tr>
                            </table>


                            <table id="io" className="content-table">
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
                            {/* <h3 id="time" style={{ marginTop: '15px' }}> t = -1</h3> */}
                            {/* <div style={{ marginTop: '60px' }}> */}
                                {/* <div id="txt"> </div> */}
                            {/* </div> */}
                            {/* <div id="t" style="height: 250px;"></div> */}
                            <br/><br/><br/><br/><br/><br/>
                            <div className='section-heading text-left' style={{ display: timeState !== '' ? "block" : 'none', float: 'left' }}>
                                Gantt Chart
                            </div><br/><br/>
                            <Chart
                                chartType='Timeline'
                                data={ ganttChartState.dataTable }
                                options={ ganttChartState.options }
                            />
                            <br/>
                            <div className='section-heading text-left' style={{ display: timeState !== '' ? "block" : 'none', float: 'left' }}>
                                Timeline Chart
                            </div><br/><br/>
                            <Chart
                                chartType='Timeline'
                                data={ timelineChartState.dataTable }
                                options={ timelineChartState.options }
                            />
                        </div>
                    </div>
                    </center>
                    <DialogBox open={ timeLogDialogState } onClose={ handleTimeLogDialogClose } title='Time Log' content={
                        <div>
                            {
                                timeLogState.list.length > 0 ?
                                    <React.Fragment>
                                        <div key='table-title' style={{ display: 'flex', padding: '6px 10px', borderBottom: '1px solid #666' }}>
                                            <div className='title' style={{ flex: '1 1 20%', padding: '5px' }}>Time</div>
                                            <div className='title' style={{ flex: '1 1 80%', padding: '5px' }}>Log</div>
                                        </div>
                                        {
                                            timeLogState.list.map((item, key) => {
                                                return (
                                                    <div key={key} style={{ display: 'flex', padding: '6px 10px', borderBottom: '1px solid #666' }}>
                                                        <div className='title' style={{ flex: '1 1 20%', padding: '5px' }}>{item.i}</div>
                                                        <div className='title' style={{ flex: '1 1 80%', padding: '5px' }}>{item.txt}</div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </React.Fragment>
                                :
                                    <div className='title'>No time log to show.</div>
                            }
                        </div>
                    } />
                    <DialogBox open={ ganttDialogState } onClose={ handleGanttDialogClose } title='Gantt Chart' content={
                        <div>
                            {
                                finalGanttChartState.dataTable.length > 1 ?
                                    <Chart
                                        chartType='Timeline'
                                        data={ finalGanttChartState.dataTable }
                                        options={ finalGanttChartState.options }
                                    />
                                :
                                    <div className='title'>Nothing to show.</div>
                            }
                        </div>
                    } />
                    <DialogBox open={ timelineDialogState } onClose={ handleTimelineDialogClose } title='Timeline Chart' content={
                        <div>
                            {
                                finalTimelineChartState.dataTable.length > 1 ?
                                    <Chart
                                        chartType='Timeline'
                                        data={ finalTimelineChartState.dataTable }
                                        options={ finalTimelineChartState.options }
                                    />
                                :
                                    <div className='title'>Nothing to show.</div>
                            }
                        </div>
                    } />
                </div>
            </div>
        </div>
    );
}

export default Algo;


{/* <DialogBox open={ dialogState } onClose={ handleDialogClose } title='Priority Settings' content={
    <div>
        <DropdownMenu open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown0' label='Priority 1' menuList={ priorityList.current['dropdown0'] } />
        <DropdownMenu open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown1' label='Priority 2' menuList={ priorityList.current['dropdown1'] } />
        <DropdownMenu display={ showDropDown2State } open={ priorityState } selectedItem={ priorityState } changeItem={ handlePriorityChange } id='dropdown2' label='Priority 3' menuList={ priorityList.current['dropdown2'] } />
    </div>
} /> */}