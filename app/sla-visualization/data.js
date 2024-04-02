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
                    "code": "measurement1",
                    "description": "something",
                    "start_status": "awaiting approval",
                    "end_status": "awaiting labour",
                    "progress": 25,
                    "status": "active",
                    "duration": "27:00"
                }
            ]
        },
        {
            "id": "1002",
            "code": "SLA-2",
            "description": "something",
            "measurements": [
                {
                    "id": "1003",
                    "code": "measurement1",
                    "description": "something",
                    "start_status": "awaiting approval",
                    "end_status": "awaiting labour",
                    "progress": 50,
                    "status": "active",
                    "duration": "27:00"
                }
            ]
        },
        {
            "id": "1003",
            "code": "SLA-3",
            "description": "something",
            "measurements": [
                {
                    "id": "1003",
                    "code": "measurement1",
                    "description": "something",
                    "start_status": "awaiting approval",
                    "end_status": "awaiting labour",
                    "progress": 75,
                    "status": "active",
                    "duration": "27:00"
                }
            ]
        }
    ]
}