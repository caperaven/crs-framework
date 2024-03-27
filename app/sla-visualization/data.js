export const data = {
    "statuses": [
        {
            "id": 1,
            "name": "New"
        },
        {
            "id": 2,
            "name": "In Progress"
        },
        {
            "id": 3,
            "name": "Completed"
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
                    "progress": 5,
                    "status": "true",
                    "duration": "27:00"
                }
            ]
        }
    ]
}