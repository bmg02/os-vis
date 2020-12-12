export function performCalculation(algoName, rowValueState, setRowValueState, visualState, setVisualState, ganttChartState, setGanttChartState, setTimelineChartState) {
    let valuesRows = [...rowValueState.value];

    let lastIndx = valuesRows.pop();

    let n = valuesRows.length;
    // console.log(n);

    let at = [];
    let total_cpu_burst = [];
    let total_io_burst = [];
    let next_cpu_burst = [];
    let total_left_cpu_burst = [];
    let total_left_io_burst = [];

    let all_bts = [];

    // google.charts.load('current', {'packages':['timeline']});

    for (let i in valuesRows) {
        // console.log(i);
        total_cpu_burst.push(0);
        total_left_cpu_burst.push(0);
        total_io_burst.push(0);
        at.push(parseInt(valuesRows[i]['atime']));
        let bts = [];
        if (parseInt(valuesRows[i]['ioTimes']) == 0) {
            bts.push(parseInt(valuesRows[i]['btime']));
            // continue;
        }
        else {
            for (let j = 0; j <= valuesRows[i]['ioTimes']; j++) {
                if (j === valuesRows[i]['ioTimes']) {
                    bts.push(parseInt(valuesRows[i]['btime' + j]));
                }
                else {
                    bts.push(parseInt(valuesRows[i]['btime' + j]));
                    bts.push(parseInt(valuesRows[i]['iobtime' + (j + 1)]));
                }
            }
        }
        for (let j = 0; j < bts.length; j++) {
            if (j % 2 === 0) {
                total_cpu_burst[i] += bts[j];
                total_left_cpu_burst[i] = total_cpu_burst[i];
            }
            else {
                total_io_burst[i] += bts[j];
                total_left_io_burst[i] = total_io_burst[i];
            }
        }
        next_cpu_burst.push(bts[0]);
        all_bts.push(bts);
    }

    // console.log(valuesRows);
    // console.log(at);
    // console.log(all_bts);

    let terminated_at_every_time = [[]];
    let running_at_every_time = [[]];
    let io_at_every_time = [[]];
    let ready_at_every_time = [[]];
    let not_arrived_at_every_time = [[]];
    let blah = [[]];

    var cols=["AT","Total CPU BT Left","Total CPU BT","Next CPU BT","Total IOBT","Next Left CPU BT","P. No.","First AT","Total (CPU+IO) BT Left","Priority"];

    let curr_terminated = []; //[P.No., Terminated At]
    let curr_running = []; //[P.No., Entered At, Will Leave At]
    let curr_not_arrived = []; //[P.No., Will Arrive At]
    let curr_ready = []; //[AT in Ready Queue, Total CPU BT Left, Total CPU BT, Next CPU BT, Total IOBT, Next Left CPU Burst, P.No., Main AT, Total Left (CPU+IO) BT, Priority]
    let curr_io = []; //[P.No.,Entered At,Will Leave At]
    // let blah=[];

    let io_s = []; //No. of Times a Process Went for IO

    let rt = [];
    let wt = [];
    let tat = [];
    let ct = [];

    for (let i = 0; i < n; i++) {
        curr_not_arrived.push([i, at[i]]);
        io_s.push(0);
        rt.push(0);
        wt.push(0);
        tat.push(0);
        ct.push(0);
    }

    // console.log(curr_not_arrived);

    let next_rem_cpu_burst=next_cpu_burst;

        curr_not_arrived.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });

        let tq = 2;

        if (algoName === 'round-robin') {
            tq = 2; // GET TimeQuantum FROM USER INPUT //(get_tq); //for RR
        }
        let pr = []; //Priority

        for (let i = 0; i < n; i++) {
            // pr.push(1);
            if (algoName === 'priority-scheduling-np' || algoName === 'priority-scheduling-p') pr.push(pr[i]); //for Priority Scheduling

            // PUT PRIORITY COLUMN INPUT IN ABOVE ARRAY
        }

        // pr=[1,2,3,4];

        not_arrived_at_every_time[0] = curr_not_arrived;

        //At t=-1,t=0,t=1,...
        let not_arrived_to_ready_count_at_every_time = [0];
        let io_to_ready_count_at_every_time = [0];
        let running_to_terminated_count_at_every_time =[0];
        let ready_to_running_count_at_every_time = [0];
        let running_to_ready_count_at_every_time = [0];
        let running_to_io_count_at_every_time = [0];

        let curr_time = 0;
        let cpu_util = 0;

        let sort_prior = [];

        if (algoName === 'first-come-first-serve') sort_prior = [0, 6];
        else if (algoName === 'shortest-job-first' || algoName === 'shortest-remaining-time-first') sort_prior = [1, 6];
        else if (algoName === 'longest-job-first' || algoName === 'longest-remaining-time-first') sort_prior = [-1, 6];
        else if (algoName === 'priority-scheduling-np' || algoName === 'priority-scheduling-p') {
            sort_prior = [9, 6];
        }

        // Preemtive + Non-Preemptive
        // sort_prior=[0,6]; //FCFS (Pr1:AT(In Ready State), Pr2:P.No.)
        // sort_prior=[7,6]; //FCFS (Pr1:AT(First AT), Pr2:P.No.)
        // sort_prior=[0,7,6]; //FCFS (Pr1:AT(In Ready State), Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[7,0,6]; //FCFS (Pr1:AT(First AT), Pr2:AT(In Ready State), Pr3:P.No.)

        // sort_prior=[1,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:P.No.)
        // sort_prior=[3,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:P.No.)
        // sort_prior=[8,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:P.No.)
        // sort_prior=[1,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[1,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[1,0,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[1,7,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[3,0,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[3,7,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[3,0,7,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[3,7,0,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[8,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[8,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[8,0,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[8,7,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)

        // sort_prior=[-1,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:P.No.) 
        // sort_prior=[-3,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:P.No.)
        // sort_prior=[-8,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:P.No.)
        // sort_prior=[-1,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-1,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-1,0,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-1,7,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[-3,0,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-3,7,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-3,0,7,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-3,7,0,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[-8,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-8,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-8,0,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-8,7,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)

        // Option for (1=Less Priority, 1=High Priority)
        // Max. Priority = Rows

        // Preemptive + Non-Preemptive
        // sort_prior=[9,6]; //Priority(1=High) (Pr1:Priority, Pr2:P.No.)
        // sort_prior=[9,0,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[9,7,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[9,0,7,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[9,7,0,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        // Preemptive + Non-Preemptive
        // sort_prior=[-9,6]; //Priority(1=Low) (Pr1:Priority, Pr2:P.No.)
        // sort_prior=[-9,0,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[-9,7,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[-9,0,7,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[-9,7,0,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        // Preemptive + Non-Preemptive
        // sort_prior=[,6]; //HRRN (Pr1:Ratio, Pr2:P.No.)
        // sort_prior=[,0,6]; //HRRN (Pr1:Ratio, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[,7,6]; //HRRN (Pr1:Ratio, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[,0,7,6]; //HRRN (Pr1:Ratio, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[,7,0,6]; //HRRN (Pr1:Ratio, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        //May Change, acc. to algorithm

        // let count = 15;
        while(curr_terminated.length !== n)
        {
            // console.log('curr not arrived - ', curr_not_arrived.length);
            // console.log('curr ready - ', curr_ready.length);
            // console.log('curr running - ', curr_running);
            // console.log('terminated - ', curr_terminated.length);
            // count--;
            // console.log(count);
            not_arrived_to_ready_count_at_every_time.push(0);
            io_to_ready_count_at_every_time.push(0);
            running_to_terminated_count_at_every_time.push(0);
            ready_to_running_count_at_every_time.push(0);
            running_to_ready_count_at_every_time.push(0);
            running_to_io_count_at_every_time.push(0);

            //not_arrived to ready
            let temp_not_arrived = [];
            for(let i=0; i<curr_not_arrived.length; i++) {
                let index=curr_not_arrived[i][0];
                if(curr_not_arrived[i][1] === curr_time) {
                    not_arrived_to_ready_count_at_every_time[curr_time + 1]++;
                    // console.log('---231---');
                    curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_io_burst[index] + total_left_cpu_burst[index], pr[index]]);
                }
                else temp_not_arrived.push(curr_not_arrived[i]);
            }
            curr_not_arrived = temp_not_arrived;

            //io to ready
            let temp_io = [];
            for(let i = 0; i < curr_io.length; i++) {
                let index = curr_io[i][0];
                total_left_io_burst[index]--;
                if(curr_io[i][2] === curr_time) {
                    // console.log('---249---');
                    io_to_ready_count_at_every_time[curr_time + 1]++;
                    curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_io_burst[index] + total_left_cpu_burst[index], pr[index]]);
                }
                else temp_io.push(curr_io[i]);
            }
            curr_io = temp_io;

            //except RR
            curr_ready.sort((a,b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]] - b[sort_prior[3]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            let curr_ready2 = [];
            for(let i = 0; i < curr_ready.length; i++) curr_ready2.push(curr_ready[i]);

            //running empty, try for "ready to running"
            if(curr_running.length === 0) {
                if(curr_ready.length !== 0) {
                    if(curr_ready[0][0]<=curr_time) {
                        // console.log('---326---');
                        ready_to_running_count_at_every_time[curr_time + 1]++;
                        let index = curr_ready[0][6];
                        if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];
                        let add = 1; //next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                        if (algoName === 'first-come-first-serve' || algoName === 'shortest-job-first' || algoName === 'longest-job-first' || algoName === 'priority-scheduling-np') add = next_cpu_burst[index];
                        else if (algoName === 'round-robin') {
                            add = Math.min(tq,next_rem_cpu_burst[index]);
                        }
                        // let add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                        // let add=Math.min(tq,next_rem_cpu_burst[index]); //for RR
                        cpu_util++;
                        curr_running.push([index, curr_time, curr_time + add]);
                        let temp_ready = [];
                        for(let i = 1; i < curr_ready.length; i++) temp_ready.push(curr_ready[i]);
                        curr_ready = temp_ready;
                    }
                }
            }   

            //else, if running ending at 'x', do running to ready/terminated/io & then ready to running
            else {
                total_left_cpu_burst[curr_running[0][0]]--;
                next_rem_cpu_burst[curr_running[0][0]]--;
                if(curr_running[0][2] === curr_time) {
                    if(parseInt(next_rem_cpu_burst[curr_running[0][0]]) !== 0) { //to Ready
                        // console.log('---357---');
                        running_to_ready_count_at_every_time[curr_time + 1]++;
                        let index = curr_running[0][0];
                        curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_cpu_burst[index]+total_left_io_burst[index], pr[index]]);
                        curr_ready2.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_cpu_burst[index]+total_left_io_burst[index], pr[index]]);
                        curr_running = [];
                    }   
                    else {
                        let index = curr_running[0][0];
                        let curr_index_in_bt_array = io_s[index] * 2;
                        if((parseInt(curr_index_in_bt_array) + 2) >= all_bts[index].length) { //to terminated state
                            // console.log('---370---');
                            ct[index] = curr_time;
                            next_cpu_burst[index] = 0;
                            running_to_terminated_count_at_every_time[curr_time + 1]++;
                            curr_terminated.push([index,curr_time]);
                            curr_running = [];
                        }
                        else { //to IO
                            next_cpu_burst[index] = all_bts[index][curr_index_in_bt_array + 2];
                            next_rem_cpu_burst[index] = next_cpu_burst[index];
                            running_to_io_count_at_every_time[curr_time + 1]++;
                            curr_io.push([index,curr_time,curr_time+all_bts[index][curr_index_in_bt_array + 1]]);
                            curr_running = [];
                            io_s[index]++;
                        }
                    }

                    //except RR
                    curr_ready.sort((a,b) => {
                        if(sort_prior.length === 2) {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                            
                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                        if(sort_prior.length === 3)
                        {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                            
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                            
                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                        if(sort_prior.length === 4) {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                            
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];

                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];

                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                    });

                    if(curr_ready.length !== 0) {
                        if(curr_ready[0][0] <= curr_time) {
                            ready_to_running_count_at_every_time[curr_time + 1]++;
                            let index=curr_ready[0][6];
                            
                            if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];
                            
                            // let add=next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                            let add = 1; //next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                            if (algoName === 'first-come-first-serve' || algoName === 'shortest-job-first' || algoName === 'longest-job-first' || algoName === 'priority-scheduling-np') add = next_cpu_burst[index];
                            else if (algoName === 'round-robin') {
                                add = Math.min(tq,next_rem_cpu_burst[index]);
                            }
                            // let add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                            // let add=Math.min(tq,next_rem_cpu_burst[index]); //for RR
                            cpu_util++;
                            curr_running.push([index, curr_time, curr_time + add]);
                            let temp_ready=[];
                            for(let i = 1; i < curr_ready.length; i++) temp_ready.push(curr_ready[i]);
                            curr_ready = temp_ready;
                        }
                    }
                }
                else cpu_util++;
            }

            curr_io.sort((a,b) => {
                if(a[2] === b[2]) return a[0] - b[0];
                return a[2] - b[2];
            });

            //except RR
            curr_ready.sort((a, b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];

                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];

                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            curr_ready2.sort((a,b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];

                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            terminated_at_every_time.push(curr_terminated);
            running_at_every_time.push(curr_running);
            io_at_every_time.push(curr_io);
            ready_at_every_time.push(curr_ready2);
            not_arrived_at_every_time.push(curr_not_arrived);
            blah.push(curr_ready);

            curr_time++;
        }

        while (running_at_every_time.length < curr_time) {
            running_at_every_time.push([]);
        }

        console.log(running_at_every_time);


        let avg_tat = 0;
        let avg_wt = 0;
        let avg_rt = 0;
        for(let i = 0; i < n; i++) {
            tat[i] = ct[i] - at[i];
            wt[i] = tat[i] - total_cpu_burst[i];
            avg_tat += tat[i];
            avg_wt += wt[i];
            avg_rt += rt[i];
        }
        cpu_util /= (curr_time - 1);
        cpu_util *= 100;
        avg_tat /= n;
        avg_wt /= n;
        avg_rt /= n;
        // console.log(at);
        // console.log(total_cpu_burst);
        // console.log(ct);
        for (let i in valuesRows) {
            valuesRows[i]['ctime'] = ct[i];
            valuesRows[i]['tatime'] = tat[i];
            valuesRows[i]['wtime'] = wt[i];
            valuesRows[i]['rtime'] = rt[i];
        }
        valuesRows.push(lastIndx);
        setVisualState({
            ...visualState,
            avgTat: avg_tat,
            avgWt: avg_wt,
            avgRt: avg_rt,
            cpuUtil: cpu_util,
            throughput: n / (curr_time - 1)
        })
        setRowValueState({ value: valuesRows });


        // console.log(tat);
        // console.log(wt);
        // console.log(rt);
        // console.log(avg_tat);
        // console.log(avg_wt);
        // console.log(avg_rt);
        // console.log(cpu_util);
        // let throughput = n / (curr_time - 1);
        // console.log(throughput);

        // console.log('terminated_at_every_time', terminated_at_every_time);
        // console.log('running_at_every_time', running_at_every_time);
        // console.log('io_at_every_time', io_at_every_time);
        // console.log('ready_at_every_time', ready_at_every_time);
        // console.log('not_arrived_at_every_time', not_arrived_at_every_time);
        // console.log('blah', blah);
        // console.log('Curr time: ', curr_time);

        // console.log(visualState);

        var table_not_arrived=document.getElementById("not-arrived");
        var table_ready=document.getElementById("ready");
        var table_running=document.getElementById("running");
        var table_io=document.getElementById("io");
        var table_terminated=document.getElementById("terminated");

        var time=document.getElementById("time");

        let curr_len=table_not_arrived.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_not_arrived.deleteRow(1);
        }
        curr_len=table_ready.rows.length;
        for(let i=0; i<curr_len; i++)
        {
            table_ready.deleteRow(1);
        }
        curr_len=table_running.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_running.deleteRow(1);
        }
        curr_len=table_io.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_io.deleteRow(1);
        }
        curr_len=table_terminated.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_terminated.deleteRow(1);
        }

        for(var i=0; i<not_arrived_at_every_time[0].length; i++)
        {
            var newRow=table_not_arrived.insertRow(table_not_arrived.length);
            for(var j=0; j<not_arrived_at_every_time[0][i].length; j++)
            {
                var cell=newRow.insertCell(j);
                cell.innerHTML=not_arrived_at_every_time[0][i][j];
            }
        }   

        var nn=table_ready.insertRow(0);
        if(sort_prior.length==0)
        {
            sort_prior=[0,6];
            for(var i=sort_prior.length-1; i>=0; i--)
            {
                var cell=nn.insertCell(sort_prior.length-i-1);
                cell.innerHTML=cols[sort_prior[i]];
                cell.style.fontWeight="bold";
            }
            sort_prior=[];
        }
        for(var i=sort_prior.length-1; i>=0; i--)
        {
            var cell=nn.insertCell(sort_prior.length-i-1);
            cell.innerHTML=cols[Math.abs(sort_prior[i])];
            cell.style.fontWeight="bold";
        }

        // console.log(ready_at_every_time[2]);
        // console.log(blah[2]);

        var shifts=[];
        var mainn;
        shifts.push(0);
        for(var i=1; i<curr_time; i++)
        {
            var add=not_arrived_to_ready_count_at_every_time[i+1];
            add+=io_to_ready_count_at_every_time[i+1];
            add+=running_to_terminated_count_at_every_time[i+1];
            add+=running_to_io_count_at_every_time[i+1];
            add+=running_to_ready_count_at_every_time[i+1];
            add+=ready_to_running_count_at_every_time[i+1];
        }

        function sleep(ms) 
        {
            return new Promise(resolve => setTimeout(resolve,ms));
        }

        async function timeout2(i,k)
        {
            // To insert rows in ready table
            var new_row=table_ready.insertRow(table_ready.rows.length);
            if(sort_prior.length==0)
            {
                sort_prior=[0,6];
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    var cell=new_row.insertCell(sort_prior.length-ii-1);
                    cell.innerHTML=ready_at_every_time[i+1][k][sort_prior[ii]];
                }
                sort_prior=[];
            }
            // console.log(ready_at_every_time[ii+1][k]);
            for(var ii=sort_prior.length-1; ii>=0; ii--)
            {
                var cell=new_row.insertCell(sort_prior.length-ii-1);
                cell.innerHTML=ready_at_every_time[i+1][k][Math.abs(sort_prior[ii])];
            }
        }

        async function timeout3(i,ind,k)
        {
            // Inserting in terminated table
            var pno=terminated_at_every_time[i+1][k][0];
            var terminate_time=terminated_at_every_time[i+1][k][1];
            var new_row=table_terminated.insertRow(table_terminated.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=pno;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=terminate_time;
        }

        async function timeout4(i,k)
        {
            // Inserting in I/O table
            var pno=io_at_every_time[i+1][k][0];
            var col2=io_at_every_time[i+1][k][1];
            var col3=io_at_every_time[i+1][k][2];
            var new_row=table_io.insertRow(table_io.rows.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=pno;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=col2;
            var cell3=new_row.insertCell(2);
            cell3.innerHTML=col3;
        }

        async function timeout5(i,k)
        {
            // Inserting in ready table
            var new_row=table_ready.insertRow(table_ready.rows.length);
            if(sort_prior.length==0)
            {
                sort_prior=[0,6];
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    var cell=new_row.insertCell(sort_prior.length-ii-1);
                    cell.innerHTML=ready_at_every_time[i+1][k][sort_prior[ii]];
                }
                sort_prior=[];
            }
            for(var ii=sort_prior.length-1; ii>=0; ii--)
            {
                var cell=new_row.insertCell(sort_prior.length-ii-1);
                cell.innerHTML=ready_at_every_time[i+1][k][Math.abs(sort_prior[ii])];
            }
        }

        var colorss=[];
        var first=[];
        for(var i=0; i<n; i++)
        {
            first.push(false);
        }

        async function dc1(i)
        {
            // google.charts.load('current', {'packages':['timeline']});
            // google.charts.setOnLoadCallback(async function => {
                var container = document.getElementById('timeline');
                // var chart = new google.visualization.Timeline(container);
                // var dataTable = new google.visualization.DataTable();
                // dataTable.addColumn({ type: 'string', id: 'Process' });
                // dataTable.addColumn({ type: 'number', id: 'Start' });
                // dataTable.addColumn({ type: 'number', id: 'End' });
                let dataTable = [];
                for(var ii=0; ii<=i+1; ii++)
                {
                    for(var jj=0; jj<running_at_every_time[ii].length; jj++)
                    {
                        dataTable.push(['P'+running_at_every_time[ii][jj][0], running_at_every_time[ii][jj][1]*1000, Math.min(ii+2,running_at_every_time[ii][jj][2])*1000 ]);
                        ii+=Math.min(ii+2,running_at_every_time[ii][jj][2]);
                        ii--;
                    }
                }
                var options = {
                  colors: colorss
                };
                setTimelineChartState({ dataTable, options });
                // chart.draw(dataTable,options);
            // };
        }

        var colors= ["#5e97f6", "#db4437", "#f2a600", "#0f9d58", "#ab47bc", "#00acc1", "#ff7043", "#9e9d24", "#5c6bc0", "#f06292", "#00796b","#c2185b", "#2a56c6", "#a52714", "#ee8100", "#0b8043", "#6a1b9a", "#00838f", "#e64a19", "#827717", "#3949ab", "#e91e63", "#004d40", "#880e4f", "#c6dafc", "#f4c7c3", "#fce8b2", "#b7e1cd", "#e1bee7", "#b2ebf2", "#ffccbc", "#f0f4c3", "#c5cae9", "#f8bbd0", "#b2dfdb", "#f48fb1"];


        let c_running = -1;
        async function dc2(i)
        {
            console.log("i + 1: ", i+1);
            // google.charts.load('current', {'packages':['timeline']});
            // google.charts.setOnLoadCallback(drawChart);
            // function drawChart() 
            // {
                // var container = document.getElementById('gantt');
                // var chart = new google.visualization.Timeline(container);
                // var dataTable = new google.visualization.DataTable();
                // let dataTab = document.getElementById('ganttChart').data;
                // dataTable.addColumn({ type: 'string', id: 'Position' });
                // dataTable.addColumn({ type: 'string', id: 'Process' });
                // dataTable.addColumn({ type: 'number', id: 'Start' });
                // dataTable.addColumn({ type: 'number', id: 'End' });
                let dataTable = [];
                let dataColumn = ganttChartState.dataTable[0];
                dataTable.push(dataColumn);

                for(var ii=0; ii <= i; ii++)
                {
                    i = parseInt(i);
                    console.log(ii, running_at_every_time[ii]);
                    if (typeof(running_at_every_time[ii]) === 'object') {
                        console.log('742');
                    }
                    else break;
                    for(var jj=0; jj<running_at_every_time[ii].length; jj++)
                    {
                        // if (ii != running_at_every_time[ii][jj][1]) continue;
                        if (running_at_every_time[ii][jj][2] >= parseInt(i) + 1) {
                            console.log('743');
                            dataTable.push([
                                'Process',
                                'P'+running_at_every_time[ii][jj][0],
                                parseInt(running_at_every_time[ii][jj][1]) * 1000,
                                (parseInt(i) + 1) * 1000
                            ]);
                            ii = i + 1;
                            // ii += Math.min(i+1, parseInt(running_at_every_time[ii][jj][2]));
                            // ii--;
                        }
                        else {
                            dataTable.push([
                                'Process',
                                'P'+running_at_every_time[ii][jj][0],
                                parseInt(running_at_every_time[ii][jj][1]) * 1000,
                                parseInt(running_at_every_time[ii][jj][2]) * 1000
                            ]);
                            ii += parseInt(running_at_every_time[ii][jj][2]);
                            ii--;
                        }
                        

                        // ii += Math.max(ii+2,running_at_every_time[ii][jj][2] + 1);
                        // ii--;
                    }
                }
                var options = {
                  timeline: { showRowLabels: false },
                  colors: colorss
                };
                console.log(dataTable);
                setGanttChartState({ dataTable, options });
                // chart.draw(dataTable,options);
            // }
        }

        async function timeout8(i)
        {
            // Inserting in running table
            var col1=running_at_every_time[i+1][0][0];
            var col2=running_at_every_time[i+1][0][1];
            var col3=running_at_every_time[i+1][0][2];
            var new_row=table_running.insertRow(table_running.rows.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=col1;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=col2;
            var cell3=new_row.insertCell(2);
            cell3.innerHTML=col3;

            // await dc2(i);
            // google.charts.setOnLoadCallback(await dc1(i));
            // google.charts.setOnLoadCallback(await dc2(i));
        }

        async function timeout6(i)
        {
            for(var j=1; j<Math.min(blah[i].length+1,table_ready.rows.length); j++)
            {
                if(sort_prior.length==0)
                {
                    sort_prior=[0,6];
                    for(var ii=sort_prior.length-1; ii>=0; ii--)
                    {
                        table_ready.rows[j].cells[sort_prior.length-ii-1].innerHTML=blah[i][j-1][sort_prior[ii]];
                    }
                    sort_prior=[];
                }
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    table_ready.rows[j].cells[sort_prior.length-ii-1].innerHTML=blah[i][j-1][Math.abs(sort_prior[ii])];
                }
            }
        }

        async function timeout7(i)
        {
            for(var j=1; j<table_io.rows.length; j++)
            {
                // Sorting I/O
                table_io.rows[j].cells[0].innerHTML=io_at_every_time[i+1][j-1][0];
                table_io.rows[j].cells[1].innerHTML=io_at_every_time[i+1][j-1][1];
                table_io.rows[j].cells[2].innerHTML=io_at_every_time[i+1][j-1][2];
            }
        }

        var txt=document.getElementById('txt');

        async function timeout1(i)
        {
            setTimeout(async function() {
                if(i==0)
                {
                    await sleep(500);
                }
                await sleep(100);
                txt.innerHTML="";
                time.innerHTML=("t = " + i);

                // Not arrived to ready table
                for(var j=0; j<not_arrived_to_ready_count_at_every_time[i+1]; j++)
                {
                    var pno_of_transfer=table_not_arrived.rows[1].cells[0].innerHTML;
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==pno_of_transfer)
                        {
                            table_not_arrived.rows[1].style.backgroundColor=colors[parseInt(pno_of_transfer)];
                            await sleep(300);
                            table_not_arrived.rows[1].style.backgroundColor="";
                            table_not_arrived.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + pno_of_transfer + " goes from 'Not Arrived' to 'Ready'.<br/>";
                            document.getElementById('a1').style.color=colors[parseInt(pno_of_transfer)];
                            await sleep(300);
                            await timeout2(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor=colors[parseInt(pno_of_transfer)];
                            document.getElementById('a1').style.color='#5c5c5c';
                            await sleep(300);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // I/O to ready table
                for(var j=0; j<io_to_ready_count_at_every_time[i+1]; j++)
                {
                    var pno_of_transfer=table_io.rows[1].cells[0].innerHTML;
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==pno_of_transfer)
                        {
                            table_io.rows[1].style.backgroundColor=colors[parseInt(pno_of_transfer)];
                            await sleep(300);
                            table_io.rows[1].style.backgroundColor="";
                            table_io.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + pno_of_transfer + " goes from 'IO/Blocked' to 'Ready'.<br/>";
                            document.getElementById('a6').style.color=colors[parseInt(pno_of_transfer)];
                            await sleep(300);
                            await timeout2(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor=colors[parseInt(pno_of_transfer)];
                            await sleep(300);
                            document.getElementById('a6').style.color='#5c5c5c';
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // Running to terminated table
                for(var j=0; j<running_to_terminated_count_at_every_time[i+1]; j++)
                {
                    for(var k=0; k<terminated_at_every_time[i+1].length; k++)
                    {
                        if(terminated_at_every_time[i+1][k][1]==i)
                        {
                            c_running = -1;
                            table_running.rows[1].style.backgroundColor=colors[parseInt(terminated_at_every_time[i+1][k][0])];
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + terminated_at_every_time[i+1][k][0] + " goes from 'Running' to 'Terminated'.<br/>";
                            document.getElementById('a4').style.color=colors[parseInt(terminated_at_every_time[i+1][k][0])];
                            await sleep(300);
                            await timeout3(i,table_terminated.rows.length-1,k);
                            table_terminated.rows[table_terminated.rows.length-1].style.backgroundColor=colors[parseInt(terminated_at_every_time[i+1][k][0])];
                            document.getElementById('a4').style.color='#5c5c5c';
                            await sleep(300);
                            table_terminated.rows[table_terminated.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }
                
                // Running to I/O table
                for(var j=0; j<running_to_io_count_at_every_time[i+1]; j++)
                {
                    for(var k=0; k<io_at_every_time[i+1].length; k++)
                    {
                        if(io_at_every_time[i+1][k][0]==running_at_every_time[i][0][0])
                        {
                            table_running.rows[1].style.backgroundColor=colors[parseInt(io_at_every_time[i+1][k][0])];
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + io_at_every_time[i+1][k][0] + " goes from 'Running' to 'IO/Blocked'.<br/>";
                            document.getElementById('a5').style.color=colors[parseInt(io_at_every_time[i+1][k][0])];
                            await sleep(300);
                            await timeout4(i,k);
                            table_io.rows[table_io.rows.length-1].style.backgroundColor=colors[parseInt(io_at_every_time[i+1][k][0])];
                            document.getElementById('a5').style.color='#5c5c5c';
                            await sleep(300);
                            table_io.rows[table_io.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // Running to ready table
                for(var j=0; j<running_to_ready_count_at_every_time[i+1]; j++)
                {
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==running_at_every_time[i][0][0])
                        {
                            c_running = -1;
                            table_running.rows[1].style.backgroundColor=colors[parseInt(running_at_every_time[i][0][0])];
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + running_at_every_time[i][0][0] + " goes from 'Running' to 'Ready'.<br/>";
                            document.getElementById('a3').style.color=colors[parseInt(running_at_every_time[i][0][0])];
                            await sleep(300);
                            await timeout5(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor=colors[parseInt(running_at_every_time[i][0][0])];
                            document.getElementById('a3').style.color='#5c5c5c';
                            await sleep(300);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                await sleep(600);

                // For sorting the rows in 
                await timeout6(i);
                await sleep(600);

                // For sorting I/O Rows
                await timeout7(i);

                //ready to running
                for(var j=0; j<ready_to_running_count_at_every_time[i+1]; j++)
                {
                    c_running = parseInt(running_at_every_time[i+1][0][1]);

                    if(first[parseInt(running_at_every_time[i+1][0][0])]==false)
                    {
                        first[parseInt(running_at_every_time[i+1][0][0])]=true;
                        colorss.push(colors[parseInt(running_at_every_time[i+1][0][0])]);
                    }


                    table_ready.rows[1].style.backgroundColor=colors[parseInt(running_at_every_time[i+1][0][0])];
                    await sleep(300);
                    table_ready.rows[1].style.backgroundColor="";
                    table_ready.deleteRow(1);
                    await sleep(300);
                    txt.innerHTML+="--> P" + running_at_every_time[i+1][0][0] + " goes from 'Ready' to 'Running'.<br/>";
                    document.getElementById('a2').style.color=colors[parseInt(running_at_every_time[i+1][0][0])];
                    await sleep(300);
                    await timeout8(i);
                    table_running.rows[table_running.rows.length-1].style.backgroundColor=colors[parseInt(running_at_every_time[i+1][0][0])];
                    document.getElementById('a2').style.color='#5c5c5c';
                    await sleep(300);
                    table_running.rows[table_running.rows.length-1].style.backgroundColor="";
                }
                if (running_at_every_time[i].length == 1) await dc2(i);
            },6000*i);
        }
        for(var i=0; i<curr_time; i++)
        {
            timeout1(i);
        }
}





// ALGORITHMS.JS OLD FILE

export function performCalculation(algoName, rowValueState, setRowValueState, visualState, setVisualState, ganttChartState, setGanttChartState, setTimelineChartState) {
    let valuesRows = [...rowValueState.value];

    let lastIndx = valuesRows.pop();

    let n = valuesRows.length;
    // console.log(n);

    let at = [];
    let total_cpu_burst = [];
    let total_io_burst = [];
    let next_cpu_burst = [];
    let total_left_cpu_burst = [];
    let total_left_io_burst = [];

    let all_bts = [];

    // google.charts.load('current', {'packages':['timeline']});

    for (let i in valuesRows) {
        // console.log(i);
        total_cpu_burst.push(0);
        total_left_cpu_burst.push(0);
        total_io_burst.push(0);
        at.push(parseInt(valuesRows[i]['atime']));
        let bts = [];
        if (parseInt(valuesRows[i]['ioTimes']) == 0) {
            bts.push(parseInt(valuesRows[i]['btime']));
            // continue;
        }
        else {
            for (let j = 0; j <= valuesRows[i]['ioTimes']; j++) {
                if (j === valuesRows[i]['ioTimes']) {
                    bts.push(parseInt(valuesRows[i]['btime' + j]));
                }
                else {
                    bts.push(parseInt(valuesRows[i]['btime' + j]));
                    bts.push(parseInt(valuesRows[i]['iobtime' + (j + 1)]));
                }
            }
        }
        for (let j = 0; j < bts.length; j++) {
            if (j % 2 === 0) {
                total_cpu_burst[i] += bts[j];
                total_left_cpu_burst[i] = total_cpu_burst[i];
            }
            else {
                total_io_burst[i] += bts[j];
                total_left_io_burst[i] = total_io_burst[i];
            }
        }
        next_cpu_burst.push(bts[0]);
        all_bts.push(bts);
    }

    // console.log(valuesRows);
    // console.log(at);
    // console.log(all_bts);

    let terminated_at_every_time = [[]];
    let running_at_every_time = [[]];
    let io_at_every_time = [[]];
    let ready_at_every_time = [[]];
    let not_arrived_at_every_time = [[]];
    let blah = [[]];

    var cols=["AT","Total CPU BT Left","Total CPU BT","Next CPU BT","Total IOBT","Next Left CPU BT","P. No.","First AT","Total (CPU+IO) BT Left","Priority"];

    let curr_terminated = []; //[P.No., Terminated At]
    let curr_running = []; //[P.No., Entered At, Will Leave At]
    let curr_not_arrived = []; //[P.No., Will Arrive At]
    let curr_ready = []; //[AT in Ready Queue, Total CPU BT Left, Total CPU BT, Next CPU BT, Total IOBT, Next Left CPU Burst, P.No., Main AT, Total Left (CPU+IO) BT, Priority]
    let curr_io = []; //[P.No.,Entered At,Will Leave At]
    // let blah=[];

    let io_s = []; //No. of Times a Process Went for IO

    let rt = [];
    let wt = [];
    let tat = [];
    let ct = [];

    for (let i = 0; i < n; i++) {
        curr_not_arrived.push([i, at[i]]);
        io_s.push(0);
        rt.push(0);
        wt.push(0);
        tat.push(0);
        ct.push(0);
    }

    // console.log(curr_not_arrived);

    let next_rem_cpu_burst=next_cpu_burst;

        curr_not_arrived.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });

        let tq = 2;

        if (algoName === 'round-robin') {
            tq = 2; // GET TimeQuantum FROM USER INPUT //(get_tq); //for RR
        }
        let pr = []; //Priority

        for (let i = 0; i < n; i++) {
            // pr.push(1);
            if (algoName === 'priority-scheduling-np' || algoName === 'priority-scheduling-p') pr.push(pr[i]); //for Priority Scheduling

            // PUT PRIORITY COLUMN INPUT IN ABOVE ARRAY
        }

        // pr=[1,2,3,4];

        not_arrived_at_every_time[0] = curr_not_arrived;

        //At t=-1,t=0,t=1,...
        let not_arrived_to_ready_count_at_every_time = [0];
        let io_to_ready_count_at_every_time = [0];
        let running_to_terminated_count_at_every_time =[0];
        let ready_to_running_count_at_every_time = [0];
        let running_to_ready_count_at_every_time = [0];
        let running_to_io_count_at_every_time = [0];

        let curr_time = 0;
        let cpu_util = 0;

        let sort_prior = [];

        if (algoName === 'first-come-first-serve') sort_prior = [0, 6];
        else if (algoName === 'shortest-job-first' || algoName === 'shortest-remaining-time-first') sort_prior = [1, 6];
        else if (algoName === 'longest-job-first' || algoName === 'longest-remaining-time-first') sort_prior = [-1, 6];
        else if (algoName === 'priority-scheduling-np' || algoName === 'priority-scheduling-p') {
            sort_prior = [9, 6];
        }

        // Preemtive + Non-Preemptive
        // sort_prior=[0,6]; //FCFS (Pr1:AT(In Ready State), Pr2:P.No.)
        // sort_prior=[7,6]; //FCFS (Pr1:AT(First AT), Pr2:P.No.)
        // sort_prior=[0,7,6]; //FCFS (Pr1:AT(In Ready State), Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[7,0,6]; //FCFS (Pr1:AT(First AT), Pr2:AT(In Ready State), Pr3:P.No.)

        // sort_prior=[1,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:P.No.)
        // sort_prior=[3,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:P.No.)
        // sort_prior=[8,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:P.No.)
        // sort_prior=[1,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[1,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[1,0,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[1,7,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[3,0,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[3,7,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[3,0,7,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[3,7,0,6]; //SJF,SRTF (Pr1:Shortest Next CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[8,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[8,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[8,0,7,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[8,7,0,6]; //SJF,SRTF (Pr1:Shortest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)

        // sort_prior=[-1,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:P.No.) 
        // sort_prior=[-3,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:P.No.)
        // sort_prior=[-8,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:P.No.)
        // sort_prior=[-1,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-1,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-1,0,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-1,7,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[-3,0,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-3,7,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-3,0,7,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-3,7,0,6]; //LJF,LRTF (Pr1:Longest Next CPU Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)
        // sort_prior=[-8,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:P.No.)
        // sort_prior=[-8,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:P.No.)
        // sort_prior=[-8,0,7,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:AT, Pr3:First AT, Pr4:P.No.)
        // sort_prior=[-8,7,0,6]; //LJF,LRTF (Pr1:Longest Rem. Total (CPU+IO) Burst, Pr2:First AT, Pr3:AT, Pr4:P.No.)

        // Option for (1=Less Priority, 1=High Priority)
        // Max. Priority = Rows

        // Preemptive + Non-Preemptive
        // sort_prior=[9,6]; //Priority(1=High) (Pr1:Priority, Pr2:P.No.)
        // sort_prior=[9,0,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[9,7,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[9,0,7,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[9,7,0,6]; //Priority(1=High) (Pr1:Priority, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        // Preemptive + Non-Preemptive
        // sort_prior=[-9,6]; //Priority(1=Low) (Pr1:Priority, Pr2:P.No.)
        // sort_prior=[-9,0,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[-9,7,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[-9,0,7,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[-9,7,0,6]; //Priority(1=Low) (Pr1:Priority, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        // Preemptive + Non-Preemptive
        // sort_prior=[,6]; //HRRN (Pr1:Ratio, Pr2:P.No.)
        // sort_prior=[,0,6]; //HRRN (Pr1:Ratio, Pr2:AT(In Ready State), Pr3:P.No.)
        // sort_prior=[,7,6]; //HRRN (Pr1:Ratio, Pr2:AT(First AT), Pr3:P.No.)
        // sort_prior=[,0,7,6]; //HRRN (Pr1:Ratio, Pr2:AT(In Ready State), Pr3:AT(First AT), Pr4:P.No.)
        // sort_prior=[,7,0,6]; //HRRN (Pr1:Ratio, Pr2:AT(First AT), Pr3:AT(In Ready State), Pr4:P.No.)

        //May Change, acc. to algorithm

        // let count = 15;
        while(curr_terminated.length !== n)
        {
            // console.log('curr not arrived - ', curr_not_arrived.length);
            // console.log('curr ready - ', curr_ready.length);
            // console.log('curr running - ', curr_running);
            // console.log('terminated - ', curr_terminated.length);
            // count--;
            // console.log(count);
            not_arrived_to_ready_count_at_every_time.push(0);
            io_to_ready_count_at_every_time.push(0);
            running_to_terminated_count_at_every_time.push(0);
            ready_to_running_count_at_every_time.push(0);
            running_to_ready_count_at_every_time.push(0);
            running_to_io_count_at_every_time.push(0);

            //not_arrived to ready
            let temp_not_arrived = [];
            for(let i=0; i<curr_not_arrived.length; i++) {
                let index=curr_not_arrived[i][0];
                if(curr_not_arrived[i][1] === curr_time) {
                    not_arrived_to_ready_count_at_every_time[curr_time + 1]++;
                    // console.log('---231---');
                    curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_io_burst[index] + total_left_cpu_burst[index], pr[index]]);
                }
                else temp_not_arrived.push(curr_not_arrived[i]);
            }
            curr_not_arrived = temp_not_arrived;

            //io to ready
            let temp_io = [];
            for(let i = 0; i < curr_io.length; i++) {
                let index = curr_io[i][0];
                total_left_io_burst[index]--;
                if(curr_io[i][2] === curr_time) {
                    // console.log('---249---');
                    io_to_ready_count_at_every_time[curr_time + 1]++;
                    curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_io_burst[index] + total_left_cpu_burst[index], pr[index]]);
                }
                else temp_io.push(curr_io[i]);
            }
            curr_io = temp_io;

            //except RR
            curr_ready.sort((a,b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]] - b[sort_prior[3]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            let curr_ready2 = [];
            for(let i = 0; i < curr_ready.length; i++) curr_ready2.push(curr_ready[i]);

            //running empty, try for "ready to running"
            if(curr_running.length === 0) {
                if(curr_ready.length !== 0) {
                    if(curr_ready[0][0]<=curr_time) {
                        // console.log('---326---');
                        ready_to_running_count_at_every_time[curr_time + 1]++;
                        let index = curr_ready[0][6];
                        if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];
                        let add = 1; //next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                        if (algoName === 'first-come-first-serve' || algoName === 'shortest-job-first' || algoName === 'longest-job-first' || algoName === 'priority-scheduling-np') add = next_cpu_burst[index];
                        else if (algoName === 'round-robin') {
                            add = Math.min(tq,next_rem_cpu_burst[index]);
                        }
                        // let add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                        // let add=Math.min(tq,next_rem_cpu_burst[index]); //for RR
                        cpu_util++;
                        curr_running.push([index, curr_time, curr_time + add]);
                        let temp_ready = [];
                        for(let i = 1; i < curr_ready.length; i++) temp_ready.push(curr_ready[i]);
                        curr_ready = temp_ready;
                    }
                }
            }   

            //else, if running ending at 'x', do running to ready/terminated/io & then ready to running
            else {
                total_left_cpu_burst[curr_running[0][0]]--;
                next_rem_cpu_burst[curr_running[0][0]]--;
                if(curr_running[0][2] === curr_time) {
                    if(parseInt(next_rem_cpu_burst[curr_running[0][0]]) !== 0) { //to Ready
                        // console.log('---357---');
                        running_to_ready_count_at_every_time[curr_time + 1]++;
                        let index = curr_running[0][0];
                        curr_ready.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_cpu_burst[index]+total_left_io_burst[index], pr[index]]);
                        curr_ready2.push([curr_time, total_left_cpu_burst[index], total_cpu_burst[index], next_cpu_burst[index], total_io_burst[index], next_rem_cpu_burst[index], index, at[index], total_left_cpu_burst[index]+total_left_io_burst[index], pr[index]]);
                        curr_running = [];
                    }   
                    else {
                        let index = curr_running[0][0];
                        let curr_index_in_bt_array = io_s[index] * 2;
                        if((parseInt(curr_index_in_bt_array) + 2) >= all_bts[index].length) { //to terminated state
                            // console.log('---370---');
                            ct[index] = curr_time;
                            next_cpu_burst[index] = 0;
                            running_to_terminated_count_at_every_time[curr_time + 1]++;
                            curr_terminated.push([index,curr_time]);
                            curr_running = [];
                        }
                        else { //to IO
                            next_cpu_burst[index] = all_bts[index][curr_index_in_bt_array + 2];
                            next_rem_cpu_burst[index] = next_cpu_burst[index];
                            running_to_io_count_at_every_time[curr_time + 1]++;
                            curr_io.push([index,curr_time,curr_time+all_bts[index][curr_index_in_bt_array + 1]]);
                            curr_running = [];
                            io_s[index]++;
                        }
                    }

                    //except RR
                    curr_ready.sort((a,b) => {
                        if(sort_prior.length === 2) {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                            
                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                        if(sort_prior.length === 3)
                        {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                            
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                            
                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                        if(sort_prior.length === 4) {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                            
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];

                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                            
                            if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];

                            return a[sort_prior[0]] - b[sort_prior[0]];
                        }
                    });

                    if(curr_ready.length !== 0) {
                        if(curr_ready[0][0] <= curr_time) {
                            ready_to_running_count_at_every_time[curr_time + 1]++;
                            let index=curr_ready[0][6];
                            
                            if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];
                            
                            // let add=next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                            let add = 1; //next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                            if (algoName === 'first-come-first-serve' || algoName === 'shortest-job-first' || algoName === 'longest-job-first' || algoName === 'priority-scheduling-np') add = next_cpu_burst[index];
                            else if (algoName === 'round-robin') {
                                add = Math.min(tq,next_rem_cpu_burst[index]);
                            }
                            // let add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                            // let add=Math.min(tq,next_rem_cpu_burst[index]); //for RR
                            cpu_util++;
                            curr_running.push([index, curr_time, curr_time + add]);
                            let temp_ready=[];
                            for(let i = 1; i < curr_ready.length; i++) temp_ready.push(curr_ready[i]);
                            curr_ready = temp_ready;
                        }
                    }
                }
                else cpu_util++;
            }

            curr_io.sort((a,b) => {
                if(a[2] === b[2]) return a[0] - b[0];
                return a[2] - b[2];
            });

            //except RR
            curr_ready.sort((a, b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];

                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];

                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            curr_ready2.sort((a,b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];

                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
                if(sort_prior.length === 4) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]] && a[sort_prior[2]] === b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])] && a[sort_prior[1]] === b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    
                    if(sort_prior[0] < 0) return b[Math.abs(sort_prior[0])] - a[Math.abs(sort_prior[0])];
                    
                    return a[sort_prior[0]] - b[sort_prior[0]];
                }
            });

            terminated_at_every_time.push(curr_terminated);
            running_at_every_time.push(curr_running);
            io_at_every_time.push(curr_io);
            ready_at_every_time.push(curr_ready2);
            not_arrived_at_every_time.push(curr_not_arrived);
            blah.push(curr_ready);

            curr_time++;
        }

        while (running_at_every_time.length < curr_time) {
            running_at_every_time.push([]);
        }

        console.log(running_at_every_time);


        let avg_tat = 0;
        let avg_wt = 0;
        let avg_rt = 0;
        for(let i = 0; i < n; i++) {
            tat[i] = ct[i] - at[i];
            wt[i] = tat[i] - total_cpu_burst[i];
            avg_tat += tat[i];
            avg_wt += wt[i];
            avg_rt += rt[i];
        }
        cpu_util /= (curr_time - 1);
        cpu_util *= 100;
        avg_tat /= n;
        avg_wt /= n;
        avg_rt /= n;
        // console.log(at);
        // console.log(total_cpu_burst);
        // console.log(ct);
        for (let i in valuesRows) {
            valuesRows[i]['ctime'] = ct[i];
            valuesRows[i]['tatime'] = tat[i];
            valuesRows[i]['wtime'] = wt[i];
            valuesRows[i]['rtime'] = rt[i];
        }
        valuesRows.push(lastIndx);
        setVisualState({
            ...visualState,
            avgTat: avg_tat,
            avgWt: avg_wt,
            avgRt: avg_rt,
            cpuUtil: cpu_util,
            throughput: n / (curr_time - 1)
        })
        setRowValueState({ value: valuesRows });


        // console.log(tat);
        // console.log(wt);
        // console.log(rt);
        // console.log(avg_tat);
        // console.log(avg_wt);
        // console.log(avg_rt);
        // console.log(cpu_util);
        // let throughput = n / (curr_time - 1);
        // console.log(throughput);

        // console.log('terminated_at_every_time', terminated_at_every_time);
        // console.log('running_at_every_time', running_at_every_time);
        // console.log('io_at_every_time', io_at_every_time);
        // console.log('ready_at_every_time', ready_at_every_time);
        // console.log('not_arrived_at_every_time', not_arrived_at_every_time);
        // console.log('blah', blah);
        // console.log('Curr time: ', curr_time);

        // console.log(visualState);

        var table_not_arrived=document.getElementById("not-arrived");
        var table_ready=document.getElementById("ready");
        var table_running=document.getElementById("running");
        var table_io=document.getElementById("io");
        var table_terminated=document.getElementById("terminated");

        var time=document.getElementById("time");

        let curr_len=table_not_arrived.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_not_arrived.deleteRow(1);
        }
        curr_len=table_ready.rows.length;
        for(let i=0; i<curr_len; i++)
        {
            table_ready.deleteRow(1);
        }
        curr_len=table_running.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_running.deleteRow(1);
        }
        curr_len=table_io.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_io.deleteRow(1);
        }
        curr_len=table_terminated.rows.length;
        for(let i=1; i<curr_len; i++)
        {
            table_terminated.deleteRow(1);
        }

        for(var i=0; i<not_arrived_at_every_time[0].length; i++)
        {
            var newRow=table_not_arrived.insertRow(table_not_arrived.length);
            for(var j=0; j<not_arrived_at_every_time[0][i].length; j++)
            {
                var cell=newRow.insertCell(j);
                cell.innerHTML=not_arrived_at_every_time[0][i][j];
            }
        }   

        var nn=table_ready.insertRow(0);
        if(sort_prior.length==0)
        {
            sort_prior=[0,6];
            for(var i=sort_prior.length-1; i>=0; i--)
            {
                var cell=nn.insertCell(sort_prior.length-i-1);
                cell.innerHTML=cols[sort_prior[i]];
                cell.style.fontWeight="bold";
            }
            sort_prior=[];
        }
        for(var i=sort_prior.length-1; i>=0; i--)
        {
            var cell=nn.insertCell(sort_prior.length-i-1);
            cell.innerHTML=cols[Math.abs(sort_prior[i])];
            cell.style.fontWeight="bold";
        }

        // console.log(ready_at_every_time[2]);
        // console.log(blah[2]);

        var shifts=[];
        var mainn;
        shifts.push(0);
        for(var i=1; i<curr_time; i++)
        {
            var add=not_arrived_to_ready_count_at_every_time[i+1];
            add+=io_to_ready_count_at_every_time[i+1];
            add+=running_to_terminated_count_at_every_time[i+1];
            add+=running_to_io_count_at_every_time[i+1];
            add+=running_to_ready_count_at_every_time[i+1];
            add+=ready_to_running_count_at_every_time[i+1];
        }

        function sleep(ms) 
        {
            return new Promise(resolve => setTimeout(resolve,ms));
        }

        async function timeout2(i,k)
        {
            // To insert rows in ready table
            var new_row=table_ready.insertRow(table_ready.rows.length);
            if(sort_prior.length==0)
            {
                sort_prior=[0,6];
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    var cell=new_row.insertCell(sort_prior.length-ii-1);
                    cell.innerHTML=ready_at_every_time[i+1][k][sort_prior[ii]];
                }
                sort_prior=[];
            }
            // console.log(ready_at_every_time[ii+1][k]);
            for(var ii=sort_prior.length-1; ii>=0; ii--)
            {
                var cell=new_row.insertCell(sort_prior.length-ii-1);
                cell.innerHTML=ready_at_every_time[i+1][k][Math.abs(sort_prior[ii])];
            }
        }

        async function timeout3(i,ind,k)
        {
            // Inserting in terminated table
            var pno=terminated_at_every_time[i+1][k][0];
            var terminate_time=terminated_at_every_time[i+1][k][1];
            var new_row=table_terminated.insertRow(table_terminated.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=pno;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=terminate_time;
        }

        async function timeout4(i,k)
        {
            // Inserting in I/O table
            var pno=io_at_every_time[i+1][k][0];
            var col2=io_at_every_time[i+1][k][1];
            var col3=io_at_every_time[i+1][k][2];
            var new_row=table_io.insertRow(table_io.rows.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=pno;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=col2;
            var cell3=new_row.insertCell(2);
            cell3.innerHTML=col3;
        }

        async function timeout5(i,k)
        {
            // Inserting in ready table
            var new_row=table_ready.insertRow(table_ready.rows.length);
            if(sort_prior.length==0)
            {
                sort_prior=[0,6];
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    var cell=new_row.insertCell(sort_prior.length-ii-1);
                    cell.innerHTML=ready_at_every_time[i+1][k][sort_prior[ii]];
                }
                sort_prior=[];
            }
            for(var ii=sort_prior.length-1; ii>=0; ii--)
            {
                var cell=new_row.insertCell(sort_prior.length-ii-1);
                cell.innerHTML=ready_at_every_time[i+1][k][Math.abs(sort_prior[ii])];
            }
        }

        var colorss=[];
        var first=[];
        for(var i=0; i<n; i++)
        {
            first.push(false);
        }

        async function dc1(i)
        {
            // google.charts.load('current', {'packages':['timeline']});
            // google.charts.setOnLoadCallback(async function => {
                var container = document.getElementById('timeline');
                // var chart = new google.visualization.Timeline(container);
                // var dataTable = new google.visualization.DataTable();
                // dataTable.addColumn({ type: 'string', id: 'Process' });
                // dataTable.addColumn({ type: 'number', id: 'Start' });
                // dataTable.addColumn({ type: 'number', id: 'End' });
                let dataTable = [];
                for(var ii=0; ii<=i+1; ii++)
                {
                    for(var jj=0; jj<running_at_every_time[ii].length; jj++)
                    {
                        dataTable.push(['P'+running_at_every_time[ii][jj][0], running_at_every_time[ii][jj][1]*1000, Math.min(ii+2,running_at_every_time[ii][jj][2])*1000 ]);
                        ii+=Math.min(ii+2,running_at_every_time[ii][jj][2]);
                        ii--;
                    }
                }
                var options = {
                  colors: colorss
                };
                setTimelineChartState({ dataTable, options });
                // chart.draw(dataTable,options);
            // };
        }

        var colors= ["#5e97f6", "#db4437", "#f2a600", "#0f9d58", "#ab47bc", "#00acc1", "#ff7043", "#9e9d24", "#5c6bc0", "#f06292", "#00796b","#c2185b", "#2a56c6", "#a52714", "#ee8100", "#0b8043", "#6a1b9a", "#00838f", "#e64a19", "#827717", "#3949ab", "#e91e63", "#004d40", "#880e4f", "#c6dafc", "#f4c7c3", "#fce8b2", "#b7e1cd", "#e1bee7", "#b2ebf2", "#ffccbc", "#f0f4c3", "#c5cae9", "#f8bbd0", "#b2dfdb", "#f48fb1"];


        let c_running = -1;
        async function dc2(i)
        {
            console.log("i + 1: ", i+1);
            // google.charts.load('current', {'packages':['timeline']});
            // google.charts.setOnLoadCallback(drawChart);
            // function drawChart() 
            // {
                // var container = document.getElementById('gantt');
                // var chart = new google.visualization.Timeline(container);
                // var dataTable = new google.visualization.DataTable();
                // let dataTab = document.getElementById('ganttChart').data;
                // dataTable.addColumn({ type: 'string', id: 'Position' });
                // dataTable.addColumn({ type: 'string', id: 'Process' });
                // dataTable.addColumn({ type: 'number', id: 'Start' });
                // dataTable.addColumn({ type: 'number', id: 'End' });
                let dataTable = [];
                let dataColumn = ganttChartState.dataTable[0];
                dataTable.push(dataColumn);

                for(var ii=0; ii <= i; ii++)
                {
                    i = parseInt(i);
                    console.log(ii, running_at_every_time[ii]);
                    if (typeof(running_at_every_time[ii]) === 'object') {
                        console.log('742');
                    }
                    else break;
                    for(var jj=0; jj<running_at_every_time[ii].length; jj++)
                    {
                        // if (ii != running_at_every_time[ii][jj][1]) continue;
                        if (running_at_every_time[ii][jj][2] >= parseInt(i) + 1) {
                            console.log('743');
                            dataTable.push([
                                'Process',
                                'P'+running_at_every_time[ii][jj][0],
                                parseInt(running_at_every_time[ii][jj][1]) * 1000,
                                (parseInt(i) + 1) * 1000
                            ]);
                            ii = i + 1;
                            // ii += Math.min(i+1, parseInt(running_at_every_time[ii][jj][2]));
                            // ii--;
                        }
                        else {
                            dataTable.push([
                                'Process',
                                'P'+running_at_every_time[ii][jj][0],
                                parseInt(running_at_every_time[ii][jj][1]) * 1000,
                                parseInt(running_at_every_time[ii][jj][2]) * 1000
                            ]);
                            ii += parseInt(running_at_every_time[ii][jj][2]);
                            ii--;
                        }
                        

                        // ii += Math.max(ii+2,running_at_every_time[ii][jj][2] + 1);
                        // ii--;
                    }
                }
                var options = {
                  timeline: { showRowLabels: false },
                  colors: colorss
                };
                console.log(dataTable);
                setGanttChartState({ dataTable, options });
                // chart.draw(dataTable,options);
            // }
        }

        async function timeout8(i)
        {
            // Inserting in running table
            var col1=running_at_every_time[i+1][0][0];
            var col2=running_at_every_time[i+1][0][1];
            var col3=running_at_every_time[i+1][0][2];
            var new_row=table_running.insertRow(table_running.rows.length);
            var cell1=new_row.insertCell(0);
            cell1.innerHTML=col1;
            var cell2=new_row.insertCell(1);
            cell2.innerHTML=col2;
            var cell3=new_row.insertCell(2);
            cell3.innerHTML=col3;

            // await dc2(i);
            // google.charts.setOnLoadCallback(await dc1(i));
            // google.charts.setOnLoadCallback(await dc2(i));
        }

        async function timeout6(i)
        {
            for(var j=1; j<Math.min(blah[i].length+1,table_ready.rows.length); j++)
            {
                if(sort_prior.length==0)
                {
                    sort_prior=[0,6];
                    for(var ii=sort_prior.length-1; ii>=0; ii--)
                    {
                        table_ready.rows[j].cells[sort_prior.length-ii-1].innerHTML=blah[i][j-1][sort_prior[ii]];
                    }
                    sort_prior=[];
                }
                for(var ii=sort_prior.length-1; ii>=0; ii--)
                {
                    table_ready.rows[j].cells[sort_prior.length-ii-1].innerHTML=blah[i][j-1][Math.abs(sort_prior[ii])];
                }
            }
        }

        async function timeout7(i)
        {
            for(var j=1; j<table_io.rows.length; j++)
            {
                // Sorting I/O
                table_io.rows[j].cells[0].innerHTML=io_at_every_time[i+1][j-1][0];
                table_io.rows[j].cells[1].innerHTML=io_at_every_time[i+1][j-1][1];
                table_io.rows[j].cells[2].innerHTML=io_at_every_time[i+1][j-1][2];
            }
        }

        var txt=document.getElementById('txt');

        async function timeout1(i)
        {
            setTimeout(async function() {
                if(i==0)
                {
                    await sleep(500);
                }
                await sleep(100);
                txt.innerHTML="";
                time.innerHTML=("t = " + i);

                // Not arrived to ready table
                for(var j=0; j<not_arrived_to_ready_count_at_every_time[i+1]; j++)
                {
                    var pno_of_transfer=table_not_arrived.rows[1].cells[0].innerHTML;
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==pno_of_transfer)
                        {
                            table_not_arrived.rows[1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_not_arrived.rows[1].style.backgroundColor="";
                            table_not_arrived.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + pno_of_transfer + " goes from 'Not Arrived' to 'Ready'.<br/>";
                            await sleep(300);
                            await timeout2(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // I/O to ready table
                for(var j=0; j<io_to_ready_count_at_every_time[i+1]; j++)
                {
                    var pno_of_transfer=table_io.rows[1].cells[0].innerHTML;
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==pno_of_transfer)
                        {
                            table_io.rows[1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_io.rows[1].style.backgroundColor="";
                            table_io.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + pno_of_transfer + " goes from 'IO/Blocked' to 'Ready'.<br/>";
                            await sleep(300);
                            await timeout2(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // Running to terminated table
                for(var j=0; j<running_to_terminated_count_at_every_time[i+1]; j++)
                {
                    for(var k=0; k<terminated_at_every_time[i+1].length; k++)
                    {
                        if(terminated_at_every_time[i+1][k][1]==i)
                        {
                            c_running = -1;
                            table_running.rows[1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + terminated_at_every_time[i+1][k][0] + " goes from 'Running' to 'Terminated'.<br/>";
                            await sleep(300);
                            await timeout3(i,table_terminated.rows.length-1,k);
                            table_terminated.rows[table_terminated.rows.length-1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_terminated.rows[table_terminated.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }
                
                // Running to I/O table
                for(var j=0; j<running_to_io_count_at_every_time[i+1]; j++)
                {
                    for(var k=0; k<io_at_every_time[i+1].length; k++)
                    {
                        if(io_at_every_time[i+1][k][0]==running_at_every_time[i][0][0])
                        {
                            table_running.rows[1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + io_at_every_time[i+1][k][0] + " goes from 'Running' to 'IO/Blocked'.<br/>";
                            await sleep(300);
                            await timeout4(i,k);
                            table_io.rows[table_io.rows.length-1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_io.rows[table_io.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                // Running to ready table
                for(var j=0; j<running_to_ready_count_at_every_time[i+1]; j++)
                {
                    for(var k=ready_at_every_time[i+1].length-1; k>=0; k--)
                    {
                        if(ready_at_every_time[i+1][k][6]==running_at_every_time[i][0][0])
                        {
                            c_running = -1;
                            table_running.rows[1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_running.rows[1].style.backgroundColor="";
                            table_running.deleteRow(1);
                            await sleep(300);
                            txt.innerHTML+="--> P" + running_at_every_time[i][0][0] + " goes from 'Running' to 'Ready'.<br/>";
                            await sleep(300);
                            await timeout5(i,k);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="lightblue";
                            await sleep(300);
                            table_ready.rows[table_ready.rows.length-1].style.backgroundColor="";
                            break;
                        }
                    }
                }

                await sleep(600);

                // For sorting the rows in 
                await timeout6(i);
                await sleep(600);

                // For sorting I/O Rows
                await timeout7(i);

                //ready to running
                for(var j=0; j<ready_to_running_count_at_every_time[i+1]; j++)
                {
                    c_running = parseInt(running_at_every_time[i+1][0][1]);

                    if(first[parseInt(running_at_every_time[i+1][0][0])]==false)
                    {
                        first[parseInt(running_at_every_time[i+1][0][0])]=true;
                        colorss.push(colors[parseInt(running_at_every_time[i+1][0][0])]);
                    }


                    table_ready.rows[1].style.backgroundColor="lightblue";
                    await sleep(300);
                    table_ready.rows[1].style.backgroundColor="";
                    table_ready.deleteRow(1);
                    await sleep(300);
                    txt.innerHTML+="--> P" + running_at_every_time[i+1][0][0] + " goes from 'Ready' to 'Running'.<br/>";
                    await sleep(300);
                    await timeout8(i);
                    table_running.rows[table_running.rows.length-1].style.backgroundColor="lightblue";
                    await sleep(300);
                    table_running.rows[table_running.rows.length-1].style.backgroundColor="";
                }
                if (running_at_every_time[i].length == 1) await dc2(i);
            },6000*i);
        }
        for(var i=0; i<curr_time; i++)
        {
            timeout1(i);
        }
}