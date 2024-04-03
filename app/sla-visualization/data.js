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
                    "id": "1002",
                    "code": "measurement 2",
                    "description": "something",
                    "start_status": 3,
                    "end_status": 6,
                    "progress": 25,
                    "status": "active",
                    "duration": "10:00"
                },
                {
                    "id": "1003",
                    "code": "measurement 3",
                    "description": "something",
                    "start_status": 7,
                    "end_status": 10,
                    "progress": 25,
                    "status": "active",
                    "duration": "50:00"
                }
            ]
        }
    ]
}