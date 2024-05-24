/**
 * @typedef {Object} Data
 * @type {{workOrder: {statusDescription: string}, statuses: [{name: string, id: number},{name: string, id: number},{name: string, id: number},{name: string, id: number},{name: string, id: number},null,null,null,null,null,null], sla: [{duration: string, code: string, description: string, id: string, measurements: [{duration: string, end_status: number, code: string, description: string, progress: number, id: string, triggers: [{id: string, trigger: number},{id: string, trigger: number}], start_status: number, status: string},{duration: string, end_status: number, code: string, description: string, progress: number, id: string, triggers: [{id: string, trigger: number},{id: string, trigger: number}], start_status: number, status: string},{duration: string, end_status: number, code: string, description: string, progress: number, id: string, triggers: [{id: string, trigger: number},{id: string, trigger: number}], start_status: number, status: string},{duration: string, end_status: number, code: string, description: string, progress: number, id: string, triggers: [{id: string, trigger: number},{id: string, trigger: number}], start_status: number, status: string}]},{duration: string, code: string, description: string, id: string, measurements: [{duration: string, end_status: number, code: string, description: string, progress: number, id: string, triggers: [{id: string, trigger: number}], start_status: number},{duration: string, end_status: number, code: string, description: string, progress: number, id: string, state: string, triggers: [{id: string, trigger: number}], start_status: number, status: string},{duration: string, end_status: number, code: string, description: string, progress: number, id: string, state: string, start_status: number, status: string}]},{duration: string, code: string, description: string, id: string, measurements: [{duration: string, end_status: number, code: string, description: string, progress: number, id: string, start_status: number, status: string}]}]}}
 * @description Data objects used in the sla visualization
 */

const data1 = {
    "currentStatus":"Approved",
    "statuses": [
        {
            "id": 1,
            "name": "Awaiting Approval"
        },
        {
            "id": 2,
            "name": "To Be Inspected"
        },
        {
            "id": 3,
            "name": "Approved"
        },
        {
            "id": 4,
            "name": "Awaiting Labour"
        },
        {
            "id": 5,
            "name": "Awaiting Spares"
        },
        {
            "id": 6,
            "name": "In Progress"
        },
        {
            "id": 7,
            "name": "Complete/Awaiting Feedback"
        },
        {
            "id": 8,
            "name": "Complete/Awaiting Costs"
        },
        {
            "id": 9,
            "name": "Completed"
        },
        {
            "id": 10,
            "name": "Closed"
        },
        {
            "id": 11,
            "name": "Cancelled"
        }
    ],
    "sla": [
        {
            "id": "1001",
            "code": "SLA-1",
            "description": "Pump Breakdown",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 25,
                    "status": "active",
                    "duration": "27:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 15,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 55,
                            "type": "overdue"
                        }
                    ]
                },
                {
                    "id": "777",
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 100,
                    "status": "active",
                    "duration": "27:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 50,
                            "type": "warning"
                        }
                    ]
                },
                {
                    "id": "1002",
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 6,
                    "progress": 50,
                    "status": "active",
                    "duration": "10:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 75,
                            "type": "overdue"
                        }
                    ]
                },
                {
                    "id": "1003",
                    "code": "Completion",
                    "description": "something",
                    "start_status": 7,
                    "end_status": 10,
                    "progress": 75,
                    "status": "active",
                    "duration": "50:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 0
                        }
                    ]
                }
            ]
        },
        {
            "id": "1002",
            "code": "SLA-2",
            "description": "something",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1004",
                    "code": "measurement 4",
                    "description": "something",
                    "start_status": 1,
                    "end_status": 2,
                    "progress": 25,
                    "duration": "27:00",
                    "triggers": [
                        {
                            "id": "1004",
                            "trigger": 75
                        }
                    ]
                },
                {
                    "id": "1005",
                    "code": "measurement 5",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 8,
                    "progress": 88,
                    "status": "active",
                    "state": "warning",
                    "duration": "10:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25
                        }
                    ]
                },
                {
                    "id": "1006",
                    "code": "measurement 6",
                    "description": "something",
                    "start_status": 9,
                    "end_status": 11,
                    "progress": 110,
                    "status": "active",
                    "state": "overdue",
                    "duration": "50:00"
                }
            ]
        },
        {
            "id": "1003",
            "code": "SLA-3",
            "description": "something",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1007",
                    "code": "measurement 7",
                    "description": "something",
                    "start_status": 1,
                    "end_status": 4,
                    "progress": 111,
                    "status": "active",
                    "duration": "27:00"
                }
            ]
        }
    ]
}

const data2 = {
    "currentStatus": "Cancelled",
    "statuses": [
        {
            "id": 1,
            "name": "Awaiting Approval"
        },
        {
            "id": 2,
            "name": "To Be Inspected"
        },
        {
            "id": 3,
            "name": "Approved"
        },
        {
            "id": 4,
            "name": "Awaiting Labour"
        },
        {
            "id": 5,
            "name": "Awaiting Spares"
        },
        {
            "id": 6,
            "name": "In Progress"
        },
        {
            "id": 7,
            "name": "Complete/Awaiting Feedback"
        },
        {
            "id": 8,
            "name": "Complete/Awaiting Costs"
        },
        {
            "id": 9,
            "name": "Completed"
        },
        {
            "id": 10,
            "name": "Closed"
        },
        {
            "id": 11,
            "name": "Cancelled"
        }
    ],
    "sla": [
        {
            "id": "1001",
            "code": "SLA-1",
            "description": "Pump Breakdown",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 25,
                    "status": "active",
                    "duration": "27:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 15,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 55,
                            "type": "warning"
                        }
                    ]
                },
                {
                    "id": "777",
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 100,
                    "status": "active",
                    "duration": "27:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 50,
                            "type": "warning"
                        }
                    ]
                },
                {
                    "id": "1002",
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 6,
                    "progress": 50,
                    "status": "active",
                    "duration": "10:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 75,
                            "type": "warning"
                        }
                    ]
                },
                {
                    "id": "1003",
                    "code": "Completion",
                    "description": "something",
                    "start_status": 7,
                    "end_status": 10,
                    "progress": 75,
                    "status": "active",
                    "duration": "50:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 0,
                            "type": "warning"
                        }
                    ]
                }
            ]
        }
    ]
}

const data3 = {
    "currentStatus": "Status 7",
    "statuses": generateStatuses(20),
    "sla": generateSLAs(25)
};

function generateStatuses(count) {
    const statuses = [];
    for (let i = 1; i <= count; i++) {
        statuses.push({"id": i, "name": `Status ${i}`});
    }
    return statuses;
}

function generateSLAs(count) {
    const slas = [];
    for (let i = 1; i <= count; i++) {
        const measurements = [];
        for (let j = 1; j <= 50; j++) {
            measurements.push({
                "id": `Measurement-${j}`,
                "code": `Measurement ${j}`,
                "description": `Measurement ${j} Description`,
                "start_status": getRandomInt(1, 20),
                "end_status": getRandomInt(1, 20),
                "progress": getRandomInt(1, 110),
                "status": "active",
                "duration": `${getRandomInt(1, 60)}:00`,
                "triggers": [{"id": `Trigger-${j}`, "trigger": getRandomInt(20, 90), "type": "warning"}]
            });
        }
        slas.push({
            "id": `SLA-${i}`,
            "code": `SLA-${i}`,
            "description": `SLA ${i} Description`,
            "duration": "99%",
            "measurements": measurements
        });
    }
    return slas;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export {data1, data2, data3}