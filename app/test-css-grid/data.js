const myData1 = [
    {
        "id": "1001",
        "code": "SLA-1",
        "description": "something",
        "measurements": [
            {
                "id": "1001",
                "code": "measurement1",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 5,
                "status": "true",
                "duration": "27:00"
            }
        ]
    },
    {
        "id": "1002",
        "code": "SLA-2",
        "description": "another thing",
        "measurements": [
            {
                "id": "1002",
                "code": "measurement2",
                "description": "another thing",
                "start_status": "in progress",
                "end_status": "completed",
                "progress": 20,
                "status": "false",
                "duration": "12:00"
            }
        ]
    },
    {
        "id": "1003",
        "code": "SLA-3",
        "description": "something else",
        "measurements": [
            {
                "id": "1003",
                "code": "measurement3",
                "description": "something else",
                "start_status": "completed",
                "end_status": "awaiting approval",
                "progress": 50,
                "status": "true",
                "duration": "15:00"
            }
        ]
    },
    {
        "id": "1004",
        "code": "SLA-4",
        "description": "another thing again",
        "measurements": [
            {
                "id": "1004",
                "code": "measurement4",
                "description": "another thing again",
                "start_status": "awaiting labour",
                "end_status": "in progress",
                "progress": 75,
                "status": "false",
                "duration": "18:00"
            }
        ]
    },
    {
        "id": "1005",
        "code": "SLA-5",
        "description": "one more thing",
        "measurements": [
            {
                "id": "1005",
                "code": "measurement5",
                "description": "one more thing",
                "start_status": "in progress",
                "end_status": "completed",
                "progress": 90,
                "status": "true",
                "duration": "21:00"
            }
        ]
    }
];
const myData2 = [
    {
        "id": "mes-1",
        "code": "SLA-1",
        "description": "something",
        "measurements": [
            {
                "id": "mes-1",
                "code": "measurement1",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 25,
                "status": true,
                "duration": "27:00"
            }
        ]
    },
    {
        "id": "mes-2",
        "code": "SLA-2",
        "description": "something",
        "measurements": [
            {
                "id": "mes-2",
                "code": "measurement2",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 50,
                "status": true,
                "duration": "27:00"
            }
        ]
    },
    {
        "id": "mes-3",
        "code": "SLA-3",
        "description": "something",
        "measurements": [
            {
                "id": "mes-3",
                "code": "measurement3",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 75,
                "status": true,
                "duration": "27:00"
            }
        ]
    },
    {
        "id": "mes-4",
        "code": "SLA-4",
        "description": "something",
        "measurements": [
            {
                "id": "mes-4",
                "code": "measurement4",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 100,
                "status": true,
                "duration": "27:00"
            }
        ]
    },
    {
        "id": "mes-5",
        "code": "SLA-5",
        "description": "something",
        "measurements": [
            {
                "id": "mes-5",
                "code": "measurement5",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 1,
                "status": true,
                "duration": "27:00"
            }
        ]
    }
];

// contain single sla object
const myData3 = [
    {
        "id": "mes-1",
        "code": "1001",
        "description": "something",
        "measurements": [
            {
                "id": "mes-1",
                "code": "measurement1",
                "description": "something",
                "start_status": "awaiting approval",
                "end_status": "awaiting labour",
                "progress": 25,
                "status": true,
                "duration": "27:00"
            }
        ]
    }
];


export {myData1, myData2, myData3};
