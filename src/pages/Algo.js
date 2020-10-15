import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Popover, makeStyles } from '@material-ui/core';
import { Drawer, Switch, Button, TableLayout, VisualTable } from '../components';
import { History, PlayArrow } from '@material-ui/icons';
import './Algo.scss';
import { capitalizeEachWord } from '../util/general';
import { performCalculation } from '../util/algorithms';

const useStyle = makeStyles(theme => ({
    menuItemRoot: {
        padding: '8px 16px',
        fontSize: '14px'
    }
}));

function Algo(props) {

    const classes = useStyle();

    const [ ioBoundState, setIoBoundState ] = React.useState(false);

    const [ anchorEl, setAnchorEl ] = React.useState(null);

    const [ tableAnimeValueState, setTableAnimeValueState ] = React.useState({
        notArrived: [],
        ready: [],
        running: [],
        waiting: [],
        ioProcess: [],
    });

    const handleChangeAlgoOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleChangeAlgoClose = (event) => {
        setAnchorEl(null);
    };

    const [ tableValueState, setTableValueState ] = React.useState({ value: [] });

    const handleSwitchChange = (e) => {
        setIoBoundState(e.target.checked);
    }

    const getVisualAnimation = () => {
        document.getElementById('visualAnimeDiv').style.display = 'inline-block';
        performCalculation(tableValueState, tableAnimeValueState, setTableAnimeValueState);
    }

    React.useEffect(() => {
        document.title = capitalizeEachWord(props.match.params.algo.replace(/-/g, ' ')) + ' at OS-VIS';
    }, []);


    return (
        <div style={{ display: 'flex' }}>
            <Drawer anchor='left' content={
                <div>
                    <div className='section-heading extra-large margin-20'>{ props.match.params.algo.replace(/-/g, ' ') }</div>
                    <div className='extra-small margin-20' style={{ alignSelf: 'baseline' }}><Link onClick={ handleChangeAlgoOpen }>Change Algorithm</Link></div>
                    <Popover
                        id="change-algo-menu"
                        anchorEl={ anchorEl }
                        keepMounted
                        open={ Boolean(anchorEl) }
                        onClose={ handleChangeAlgoClose }
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/first-come-first-serve'>First Come First Serve</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/priority-scheduling'>Priority Scheduling</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/longest-job-first'>Longest Job First</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/longest-remaining-time-first'>Longest Remaining Time First</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/round-robin'>Round Robin</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/shortest-job-first'>Shortest Job First</Link></MenuItem>
                        <MenuItem classes={{ root: classes.menuItemRoot }}><Link to='/scheduling/shortest-remaining-time-first'>Shortest Remaining Time First</Link></MenuItem>
                    </Popover>
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
                        <Button classnames='float-right' onClick={ getVisualAnimation }><div>PLAY&nbsp;&nbsp;</div><PlayArrow style={{ color: '#333' }} /></Button>
                        <br/><br/>
                        <div className='section-div'>
                            <div className='section-heading text-left'>
                                CPU Scheduling
                            </div>
                        </div>
                        <br/><br/>
                        
                        <div id='visualAnimeDiv'>
                            <VisualTable name='Not arrived' columns={['P. No.', 'AT']} rows={ tableAnimeValueState.notArrived } />
                            <VisualTable name='Ready' columns={[ 'P. No.', 'AT' ]} rows={ tableAnimeValueState.ready } />
                            <VisualTable name='Running' columns={[ 'P. No.', 'Entered at', 'Leave at' ]} rows={ tableAnimeValueState.running } />
                            <VisualTable name='Terminated' columns={[ 'P. No.', 'Terminated at' ]} rows={ tableAnimeValueState.terminated } />
                            <VisualTable name='I/O Process' columns={[ 'P. No.', 'Entered at', 'Leave at' ]} rows={ tableAnimeValueState.ioProcess } />
                        </div>
                    </div>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default Algo;