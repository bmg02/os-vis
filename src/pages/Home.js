import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

function Home() {

    React.useEffect(() => {
        document.title = 'Visualise algorithm animations at OS-VIS';
    }, []);

    return (
        <div className='container-div flex-layout'>
            <div className='section-div grey-div flex-30 full-height'>
                <div className='section-heading text-center margin-top-20'>Scheduling Algorithms</div>
                <center>
                <div className='section-content max-content-width'>
                    <ul>
                        <Link to='/scheduling/first-come-first-serve'><li>First Come First Serve</li></Link>
                        <Link to='/scheduling/priority-scheduling-np'><li>Priority Scheduling</li></Link>
                        <Link to='/scheduling/longest-job-first'><li>Longest Job First</li></Link>
                        <Link to='/scheduling/longest-remaining-time-first'><li>Longest Remaining Time First</li></Link>
                        <Link to='/scheduling/round-robin'><li>Round Robin</li></Link>
                        <Link to='/scheduling/shortest-job-first'><li>Shortest Job First</li></Link>
                        <Link to='/scheduling/shortest-remaining-time-first'><li>Shortest Remaining Time First</li></Link>
                    </ul>
                </div>
                </center>
            </div>
            <div className='section-div flex-70'>
                <center>
                <div className='section-heading text-center'>How To Use?</div><br/><br/>
                <div className='section-content flex-layout flex-space-evenly'>
                    <div className='guide-div flex-auto'>
                        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg></div>
                        <div>Select one algorithm from the given list. And choose your option for I/O bound.</div>
                    </div>
                    <div className='guide-div flex-auto'>
                        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v3H5V5h15zm-5 14h-5v-9h5v9zM5 10h3v9H5v-9zm12 9v-9h3v9h-3z"/></svg></div>
                        <div>Fill up the table with process timing. Add or remove processes dynamically with just one click.</div>
                    </div>
                    <div className='guide-div flex-auto'>
                        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><rect fill="none" height="24" width="24" x="0" y="0"/><path d="M10,16.5v-9l6,4.5L10,16.5z M22,12c0,5.52-4.48,10-10,10S2,17.52,2,12c0-1.19,0.22-2.32,0.6-3.38L4.48,9.3 C4.17,10.14,4,11.05,4,12c0,4.41,3.59,8,8,8s8-3.59,8-8s-3.59-8-8-8c-0.95,0-1.85,0.17-2.69,0.48L8.63,2.59C9.69,2.22,10.82,2,12,2 C17.52,2,22,6.48,22,12z M5.5,4C4.67,4,4,4.67,4,5.5S4.67,7,5.5,7S7,6.33,7,5.5S6.33,4,5.5,4z"/></g></svg></div>
                        <div>Visualize the clutter free animation of how the processes are executed simultaneously in the system.</div>
                    </div>
                </div>
                <div className='flex-layout' style={{ marginTop: '60px' }}>
                    <div className='flex-auto'>
                        <object data='https://www.youtube.com/embed/hi3Bt4ldEoY' alt='Video tutorial' width='460px' height='260px'></object>
                    </div>
                    <div className='small-section-content flex-auto'>
                        <div className='section-heading text-left extra-large'>Developers</div>
                        <ul>
                            <a href='https://github.com/bmg02' target='_blank' rel='noopener noreferrer'><li>Bhuvan Gandhi</li></a>
                            <a href='https://github.com/parn-desai' target='_blank' rel='noopener noreferrer'><li>Parn Desai</li></a>
                            <a href='https://github.com/ShreedharBhatt22' target='_blank' rel='noopener noreferrer'><li>Shreedhar Bhatt</li></a>
                            <a href='https://github.com/vok_8' target='_blank' rel='noopener noreferrer'><li>Vinay Khilwani</li></a>
                        </ul>
                    </div>
                </div>
                </center>
            </div>
        </div>
    );
}

export default Home;