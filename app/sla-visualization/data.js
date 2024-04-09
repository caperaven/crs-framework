export const data = {
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
            "description": "something",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "code": "measurement 1",
                    "description": "something",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 25,
                    "status": "active",
                    "duration": "27:00"
                },
                {
                    "id": "777",
                    "code": "measurement 7",
                    "description": "something else",
                    "start_status": 1,
                    "end_status": 3,
                    "progress": 100,
                    "status": "active",
                    "duration": "27:00"
                },
                {
                    "id": "1002",
                    "code": "measurement 2",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 6,
                    "progress": 50,
                    "status": "active",
                    "duration": "10:00"
                },
                {
                    "id": "1003",
                    "code": "measurement 3",
                    "description": "something",
                    "start_status": 7,
                    "end_status": 10,
                    "progress": 75,
                    "status": "active",
                    "duration": "50:00"
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
                    "status": "active",
                    "duration": "27:00"
                },
                {
                    "id": "1005",
                    "code": "measurement 5",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 8,
                    "progress": 50,
                    "status": "active",
                    "duration": "10:00"
                },
                {
                    "id": "1006",
                    "code": "measurement 6",
                    "description": "something",
                    "start_status": 9,
                    "end_status": 11,
                    "progress": 75,
                    "status": "active",
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
                    "progress": 25,
                    "status": "active",
                    "duration": "27:00"
                },
                {
                    "id": "1008",
                    "code": "measurement 8",
                    "description": "something",
                    "start_status": 5,
                    "end_status": 6,
                    "progress": 50,
                    "state": "inactive",
                    "duration": "10:00"
                },
                {
                    "id": "1009",
                    "code": "measurement 9",
                    "description": "something",
                    "start_status": 7,
                    "end_status": 10,
                    "progress": 75,
                    "status": "active",
                    "duration": "50:00"
                }
            ]
        }
    ]
}