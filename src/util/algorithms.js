// function curr_sorting(sort_prior, a, b) {
//     if(sort_prior.length === 2) {
//         if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
//         if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
//         return a[sort_prior[0]]-b[sort_prior[0]];
//     }
//     if(sort_prior.length === 3) {
//         if (a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
//         if (a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
//         if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
//         return a[sort_prior[0]]-b[sort_prior[0]];
//     }
//     if(sort_prior.length===4) {
//         if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]] && a[sort_prior[2]]===b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
//         if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
//         if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
//         if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
//         return a[sort_prior[0]]-b[sort_prior[0]];
//     }
// }


export function performCalculation(rowValues, visualState, setVisualState) {
    let valuesRows = [...rowValues.value];

    valuesRows.pop();

    var n = parseInt(valuesRows.length - 1);

    var at = [];
    var total_cpu_burst = [];
    var total_io_burst = [];
    var next_cpu_burst = [];
    var total_left_cpu_burst = [];
    var total_left_io_burst = [];

    var all_bts = [];

    for (let i in valuesRows) {
        at.push(valuesRows[i]['atime']);
        let bts = [];
        if (parseInt(valuesRows[i]['ioTimes']) === 0) {
            bts.push(valuesRows[i]['btime']);
            // continue;
        }
        else {
            for (let j = 0; j <= valuesRows[i]['ioTimes']; j++) {
                if (j === valuesRows[i]['ioTimes']) {
                    bts.push(valuesRows[i]['btime' + j]);
                }
                else {
                    bts.push(valuesRows[i]['btime' + j]);
                    bts.push(valuesRows[i]['iobtime' + (j + 1)]);
                }
            }
        }
        for (var j = 0; j < bts.length; j++) {
            if (parseInt(j) % 2 === 0) {
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

    console.log(valuesRows);
    console.log(at);
    console.log(all_bts);

    var terminated_at_every_time = [[]];
    var running_at_every_time = [[]];
    var io_at_every_time = [[]];
    var ready_at_every_time = [[]];
    var not_arrived_at_every_time = [[]];
    var blah = [[]];

    var curr_terminated = []; //[P.No., Terminated At]
    var curr_running = []; //[P.No., Entered At, Will Leave At]
    var curr_not_arrived = []; //[P.No., Will Arrive At]
    var curr_ready = []; //[AT in Ready Queue, Total CPU BT Left, Total CPU BT, Next CPU BT, Total IOBT, Next Left CPU Burst, P.No., Main AT, Total Left (CPU+IO) BT, Priority]
    var curr_io = []; //[P.No.,Entered At,Will Leave At]
    // var blah=[];

    var io_s = []; //No. of Times a Process Went for IO

    var rt = [];
    var wt = [];
    var tat = [];
    var ct = [];

    for (let i = 0; i < n; i++)
    {
        curr_not_arrived.push([i, at[i]]);
        io_s.push(0);
        rt.push(0);
        wt.push(0);
        tat.push(0);
        ct.push(0);
    }

    var next_rem_cpu_burst=next_cpu_burst;

        curr_not_arrived.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });

        var tq = 2; //(get_tq); //for RR
        var pr = []; //Priority

        for (let i = 0; i < n; i++) {
            pr.push(1);
            // pr.push(pr[i]); //for Priority Scheduling
        }

        pr=[1,2,3,4];

        not_arrived_at_every_time[0] = curr_not_arrived;

        //At t=-1,t=0,t=1,...
        var not_arrived_to_ready_count_at_every_time = [0];
        var io_to_ready_count_at_every_time = [0];
        var running_to_terminated_count_at_every_time =[0];
        var ready_to_running_count_at_every_time = [0];
        var running_to_ready_count_at_every_time = [0];
        var running_to_io_count_at_every_time = [0];

        var curr_time = 0;
        var cpu_util = 0;

        var sort_prior = [];

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
        while (parseInt(curr_terminated.length) !== n && n > 1) {
            not_arrived_to_ready_count_at_every_time.push(0);
            io_to_ready_count_at_every_time.push(0);
            running_to_terminated_count_at_every_time.push(0);
            ready_to_running_count_at_every_time.push(0);
            running_to_ready_count_at_every_time.push(0);
            running_to_io_count_at_every_time.push(0);

            //not_arrived to ready
            var temp_not_arrived = [];
            for(var i = 0; i < curr_not_arrived.length; i++) {
                var index = curr_not_arrived[i][0];
                if(curr_not_arrived[i][1] === curr_time) {
                    not_arrived_to_ready_count_at_every_time[curr_time+1]++;
                    curr_ready.push([curr_time,total_left_cpu_burst[index],total_cpu_burst[index],next_cpu_burst[index],total_io_burst[index],next_rem_cpu_burst[index],index,at[index],total_left_io_burst[index]+total_left_cpu_burst[index],pr[index]]);
                }
                else temp_not_arrived.push(curr_not_arrived[i]);
            }
            curr_not_arrived = temp_not_arrived;

            //io to ready
            var temp_io = [];
            for (let i = 0; i < curr_io.length; i++) {
                let index = curr_io[i][0];
                total_left_io_burst[index]--;
                if(curr_io[i][2] === curr_time) {
                    io_to_ready_count_at_every_time[curr_time+1]++;
                    curr_ready.push([curr_time,total_left_cpu_burst[index],total_cpu_burst[index],next_cpu_burst[index],total_io_burst[index],next_rem_cpu_burst[index],index,at[index],total_left_io_burst[index]+total_left_cpu_burst[index],pr[index]]);
                }
                else temp_io.push(curr_io[i]);
            }
            curr_io=temp_io;

            //except RR
            curr_ready.sort((a,b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if (a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
                    if (a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
                }
                if(sort_prior.length===4) {
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]] && a[sort_prior[2]]===b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
                }
            });

            var curr_ready2 = curr_ready;

            //running empty, try for "ready to running"
            if(curr_running.length === 0) {

                if(curr_ready.length !== 0) {

                    if(curr_ready[0][0] <= curr_time) {

                        ready_to_running_count_at_every_time[curr_time+1]++;
                        var index = curr_ready[0][6];
                        if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];

                        // var add=next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                        // var add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                        
                        var add = Math.min(tq,next_rem_cpu_burst[index]); //for RR
                        cpu_util++;
                        curr_running.push([index,curr_time, curr_time+add]);
                        var temp_ready = [];
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

                    if(parseInt(next_rem_cpu_burst[curr_running[0][0]]) !== 0) {

                        running_to_ready_count_at_every_time[curr_time+1]++;
                        var index=curr_running[0][0];
                        curr_ready.push([curr_time,total_left_cpu_burst[index],total_cpu_burst[index],next_cpu_burst[index],total_io_burst[index],next_rem_cpu_burst[index],index,at[index],total_left_cpu_burst[index]+total_left_io_burst[index],pr[index]]);
                        curr_running = [];
                    }   
                    else {

                        var index = curr_running[0][0];
                        var curr_index_in_bt_array = io_s[index] * 2;
                        if((parseInt(curr_index_in_bt_array) + 2) >= all_bts[index].length) //to terminated state
                        {
                            ct[index] = curr_time;
                            next_cpu_burst[index] = 0;
                            running_to_terminated_count_at_every_time[curr_time + 1]++;
                            curr_terminated.push([index, curr_time]);
                            curr_running = [];
                        }
                        else {
                            next_cpu_burst[index] = all_bts[index][curr_index_in_bt_array + 2];
                            next_rem_cpu_burst[index] = next_cpu_burst[index];
                            running_to_io_count_at_every_time[curr_time + 1]++;
                            curr_io.push([index,curr_time, curr_time+all_bts[index][curr_index_in_bt_array + 1]]);
                            curr_running = [];
                            io_s[index]++;
                        }
                    }

                    //except RR
                    curr_ready.sort((a, b) => {
                        if(sort_prior.length === 2) {
                            if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                            if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                            return a[sort_prior[0]]-b[sort_prior[0]];
                        }
                        if(sort_prior.length === 3) {
                            if (a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
                            if (a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                            if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                            return a[sort_prior[0]]-b[sort_prior[0]];
                        }
                        if(sort_prior.length===4) {
                            if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]] && a[sort_prior[2]]===b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                            if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                            if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                            if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                            return a[sort_prior[0]]-b[sort_prior[0]];
                        }
                    });

                    if(curr_ready.length !== 0) {
                        if(parseInt(curr_ready[0][0]) <= parseInt(curr_time)) {
                            ready_to_running_count_at_every_time[curr_time + 1]++;
                            var index = curr_ready[0][6];
                            if(total_cpu_burst[index] === total_left_cpu_burst[index]) rt[index]=curr_time-at[index];
                            // var add=next_cpu_burst[index]; //for FCFS(Non-Preemptive), SJF, LJF, Priority(Non-Preemptive), HRRN(Non-Preemptive)
                            // var add=1; //for SRTF, LRTF, Priority(Preemptive), HRRN(Preemptive), FCFS(Preemptive)
                            var add = Math.min(tq,next_rem_cpu_burst[index]); //for RR
                            cpu_util++;
                            curr_running.push([index, curr_time, curr_time + add]);
                            var temp_ready = [];
                            for(let i = 1; i < curr_ready.length; i++) temp_ready.push(curr_ready[i]);
                            curr_ready = temp_ready;
                        }
                    }
                }
                else cpu_util++;
            }

            curr_io.sort((a,b) => {
                if(a[2] === b[2]) return a[0]-b[0];
                return a[2]-b[2];
            });

            //except RR
            curr_ready.sort((a, b) => {
                if(sort_prior.length === 2) {
                    if(a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]] - b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
                }
                if(sort_prior.length === 3) {
                    if (a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]] - b[sort_prior[2]];
                    if (a[Math.abs(sort_prior[0])] === b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
                }
                if(sort_prior.length===4) {
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]] && a[sort_prior[2]]===b[sort_prior[2]]) return a[sort_prior[3]]-b[sort_prior[3]];
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])] && a[sort_prior[1]]===b[sort_prior[1]]) return a[sort_prior[2]]-b[sort_prior[2]];
                    if(a[Math.abs(sort_prior[0])]===b[Math.abs(sort_prior[0])]) return a[sort_prior[1]]-b[sort_prior[1]];
                    if(sort_prior[0]<0) return b[Math.abs(sort_prior[0])]-a[Math.abs(sort_prior[0])];
                    return a[sort_prior[0]]-b[sort_prior[0]];
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
        var avg_tat = 0;
        var avg_wt = 0;
        var avg_rt = 0;
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
        console.log(at);
        console.log(total_cpu_burst);
        console.log(ct);
        console.log(tat);
        console.log(wt);
        console.log(rt);
        console.log(avg_tat);
        console.log(avg_wt);
        console.log(avg_rt);
        console.log(cpu_util);
        var throughput = n / (curr_time - 1);
        console.log(throughput);
}