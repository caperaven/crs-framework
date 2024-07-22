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
            "description": "Awaiting Approval"
        },
        {
            "id": 2,
            "description": "To Be Inspected"
        },
        {
            "id": 3,
            "description": "Approved"
        },
        {
            "id": 4,
            "description": "Awaiting Labour"
        },
        {
            "id": 5,
            "description": "Awaiting Spares"
        },
        {
            "id": 6,
            "description": "In Progress"
        },
        {
            "id": 7,
            "description": "Complete/Awaiting Feedback"
        },
        {
            "id": 8,
            "description": "Complete/Awaiting Costs"
        },
        {
            "id": 9,
            "description": "Completed"
        },
        {
            "id": 10,
            "description": "Closed"
        },
        {
            "id": 11,
            "description": "Cancelled"
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
    "currentStatus": 5000001002,
    "statuses": [
        {
            "code": "AA",
            "description": "Awaiting Approval",
            "sequenceNumber": 0,
            "baseStatus": "AwaitingApproval",
            "applyStatusRestrictions": false,
            "id": 10,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Approval"
        },
        {
            "code": "*1019",
            "description": "To be Inspected",
            "sequenceNumber": 1,
            "baseStatus": "AwaitingApproval",
            "applyStatusRestrictions": false,
            "id": 5000001019,
            "version": 2,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "To be Inspected"
        },
        {
            "code": "AP",
            "description": "Approved",
            "sequenceNumber": 0,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 11,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Approved"
        },
        {
            "code": "AL",
            "description": "Awaiting Labour",
            "sequenceNumber": 1,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001001,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Labour"
        },
        {
            "code": "AS",
            "description": "Awaiting Spares",
            "sequenceNumber": 2,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001002,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Spares"
        },
        {
            "code": "IP",
            "description": "In Progress",
            "sequenceNumber": 3,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001003,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "In Progress"
        },
        {
            "code": "AF",
            "description": "Complete/Awaiting Feedback",
            "sequenceNumber": 4,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001004,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Complete/Awaiting Feedback"
        },
        {
            "code": "AC",
            "description": "Complete/Awaiting Costs",
            "sequenceNumber": 5,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001005,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Complete/Awaiting Costs"
        },
        {
            "code": "CP",
            "description": "Completed",
            "sequenceNumber": 0,
            "baseStatus": "Completed",
            "applyStatusRestrictions": false,
            "id": 12,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Completed"
        },
        {
            "code": "CL",
            "description": "Closed",
            "sequenceNumber": 0,
            "baseStatus": "Closed",
            "applyStatusRestrictions": false,
            "id": 13,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Closed"
        },
        {
            "code": "CA",
            "description": "Cancelled",
            "sequenceNumber": 0,
            "baseStatus": "Cancelled",
            "applyStatusRestrictions": false,
            "id": 14,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Cancelled"
        }
    ],
    "sla": [
        {
            "id": "1001",
            "code": "SLA-1",
            "description": "Pump Breakdown",
            "mainMeasurePercentage": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "version": 1,
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 10,
                    "end_status": 11,
                    "progress": 25,
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 5000001001,
                    "end_status": 5000001002,
                    "progress": 101,
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 5000001003,
                    "end_status": 5000001005,
                    "progress": 81,
                    "duration": "30:00",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": 11,
                    "end_status": 12,
                    "progress": 75,
                    "duration": "50:00",
                    "triggers": [
                        {
                            "id": "1001",
                            "trigger": 25,
                            "type": "warning"
                        },
                        {
                            "id": "1002",
                            "trigger": 1,
                            "type": "warning"
                        }
                    ]
                }
            ]
        }
    ]
}
const data2s = {
    "currentStatus": "Approved",
    "statuses": [
            {
                "code": "AA",
                "description": "Awaiting Approval",
                "sequenceNumber": 0,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 10,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Approval",
                "order": 0
            },
            {
                "code": "*1019",
                "description": "To be Inspected",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 5000001019,
                "version": 2,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "To be Inspected",
                "order": 1
            },
            {
                "code": "AAW",
                "description": "Awaiting Approval Workflow",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107742100001,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Logged By User-941277b6-c9a0-47f3-b40e-f381c42466d9",
                "order": 2
            },
            {
                "code": "AA-LBU-3ea54076-31d5-4ef4-8a18-9e75b05201c4",
                "description": "Logged By User-dad25c05-6994-41ad-95f7-7af7fdb378c4",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107748100017,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Logged By User-dad25c05-6994-41ad-95f7-7af7fdb378c4",
                "order": 3
            },
            {
                "code": "AA-LBU-a4ac2dfa-61fa-4aaa-8ed8-1e7833b97186",
                "description": "Logged By User-a96504c8-6f70-4125-bda2-707a1fdae28c",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107753100033,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Logged By User-a96504c8-6f70-4125-bda2-707a1fdae28c",
                "order": 4
            },
            {
                "code": "AA-LBU-81cf1f73-3efb-4e27-a4ab-233e4e2ccb13",
                "description": "Logged By User-3ea36d48-bf3f-4ec2-94f4-d99c6aa84f82",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107758100049,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Logged By User-3ea36d48-bf3f-4ec2-94f4-d99c6aa84f82",
                "order": 5
            },
            {
                "code": "AA-LBU-c5f5c2ee-00e8-4192-aa6d-32d0a37c695b",
                "description": "Logged By User-7c11b693-5cb2-4faa-92ea-c7bfd2d7fd17",
                "sequenceNumber": 1,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107771100065,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Logged By User-7c11b693-5cb2-4faa-92ea-c7bfd2d7fd17",
                "order": 6
            },
             {
                "code": "AA-RevReq-866ec678-5f15-4a83-987d-97c107e7877d",
                "description": "Review Request-1c90c8ba-f721-45a9-8efa-953165ea419d",
                "sequenceNumber": 2,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107742100002,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Review Request-1c90c8ba-f721-45a9-8efa-953165ea419d",
                "order": 7
            },
             {
                "code": "AA-RevReq-38fcdd49-ff68-4823-96e1-362da9de99a2",
                "description": "Review Request-5430c123-90e8-489e-a508-1f4939346366",
                "sequenceNumber": 2,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107748100018,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Review Request-5430c123-90e8-489e-a508-1f4939346366",
                "order": 8
            },
             {
                "code": "AA-RevReq-ff7a8b44-b261-4269-8bf5-45f23b1f6e25",
                "description": "Review Request-538c7ca2-a6b1-44eb-ae71-dbeb33445be1",
                "sequenceNumber": 2,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107753100034,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Review Request-538c7ca2-a6b1-44eb-ae71-dbeb33445be1",
                "order": 9
            },
             {
                "code": "AA-RevReq-47cccbe8-1541-4fe3-a1c6-8b9850514181",
                "description": "Review Request-f74809f1-da1b-4f78-b86f-8bd5ab09ce84",
                "sequenceNumber": 2,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107758100050,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Review Request-f74809f1-da1b-4f78-b86f-8bd5ab09ce84",
                "order": 10
            },
             {
                "code": "AA-RevReq-42b9418a-94e7-441c-9e33-a446c63dfa58",
                "description": "Review Request-66a1d215-7bcc-4da0-a58c-3c7aca26c7a0",
                "sequenceNumber": 2,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107771100066,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Review Request-66a1d215-7bcc-4da0-a58c-3c7aca26c7a0",
                "order": 11
            },
             {
                "code": "AA-AwaitQ-372bcf66-a80c-4a27-be51-0220072a8bcf",
                "description": "Awaiting Quotes-3ae4c708-342f-4207-bf24-6af3c2e5eb51",
                "sequenceNumber": 3,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107742100003,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Quotes-3ae4c708-342f-4207-bf24-6af3c2e5eb51",
                "order": 12
            },
             {
                "code": "AA-AwaitQ-433ffa8f-bb51-45cf-8ef2-cb241ee8ea7a",
                "description": "Awaiting Quotes-6135b27a-15a7-4644-adf7-8d2f23f10e18",
                "sequenceNumber": 3,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107749100019,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Quotes-6135b27a-15a7-4644-adf7-8d2f23f10e18",
                "order": 13
            },
             {
                "code": "AA-AwaitQ-0db37ed9-dacd-44e9-8aa5-b7a7b62ba4ea",
                "description": "Awaiting Quotes-6a33b37c-b0db-41fa-adea-5dce63c65e91",
                "sequenceNumber": 3,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107753100035,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Quotes-6a33b37c-b0db-41fa-adea-5dce63c65e91",
                "order": 14
            },
             {
                "code": "AA-AwaitQ-ab0c8f0a-212c-412b-a55e-a7880cd3382e",
                "description": "Awaiting Quotes-76a2be32-42aa-46a6-91b9-8957f349a287",
                "sequenceNumber": 3,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107758100051,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Quotes-76a2be32-42aa-46a6-91b9-8957f349a287",
                "order": 15
            },
             {
                "code": "AA-AwaitQ-9dfe7f58-fca2-4084-991b-d334982fbe0b",
                "description": "Awaiting Quotes-2b129c4f-3572-48b3-b6dc-cd49e8401205",
                "sequenceNumber": 3,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107771100067,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Quotes-2b129c4f-3572-48b3-b6dc-cd49e8401205",
                "order": 16
            },
             {
                "code": "AA-RevQ-3cd88296-0747-41d8-93b6-a71edf77af73",
                "description": "Reviewing Quotes-f519802e-ad0d-4f89-9ed3-20861f6e04e7",
                "sequenceNumber": 4,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107742100004,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Reviewing Quotes-f519802e-ad0d-4f89-9ed3-20861f6e04e7",
                "order": 17
            },
             {
                "code": "AA-RevQ-99768139-9287-4b8d-9ef8-a266d7f1ada4",
                "description": "Reviewing Quotes-5ee0cb89-a20b-46dc-8a69-48f247428c2c",
                "sequenceNumber": 4,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107749100020,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Reviewing Quotes-5ee0cb89-a20b-46dc-8a69-48f247428c2c",
                "order": 18
            },
             {
                "code": "AA-RevQ-396011b2-f0a5-4158-90e0-04ed15dd36f6",
                "description": "Reviewing Quotes-beae61ea-a02a-42ec-b041-4948dfe6734a",
                "sequenceNumber": 4,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107753100036,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Reviewing Quotes-beae61ea-a02a-42ec-b041-4948dfe6734a",
                "order": 19
            },
            {
                "code": "AA-RevQ-b76eec8a-d0c5-4f79-b48a-2e085f72c08e",
                "description": "Reviewing Quotes-7226349a-f87a-4c5a-829b-bbe296062882",
                "sequenceNumber": 4,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107758100052,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Reviewing Quotes-7226349a-f87a-4c5a-829b-bbe296062882",
                "order": 20
            },
             {
                "code": "AA-RevQ-a7a6d593-0681-4b84-afd7-9ac925457dc4",
                "description": "Reviewing Quotes-ed6c00d8-294c-461c-a4ad-786eaad46f86",
                "sequenceNumber": 4,
                "baseStatus": "AwaitingApproval",
                "applyStatusRestrictions": false,
                "id": 1720107771100068,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Reviewing Quotes-ed6c00d8-294c-461c-a4ad-786eaad46f86",
                "order": 21
            },
            {
                "code": "AP",
                "description": "Approved",
                "sequenceNumber": 0,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 11,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Approved",
                "order": 22
            },
             {
                "code": "AL",
                "description": "Awaiting Labour",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 5000001001,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Labour",
                "order": 23
            },
             {
                "code": "AP-QAccConSel-70f816af-344e-4335-989c-651ad10a61c5",
                "description": "Quote Accepted - Contractor Selected-75624d57-f6df-4fa3-8575-a02daae7768e",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107742100005,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Quote Accepted - Contractor Selected-75624d57-f6df-4fa3-8575-a02daae7768e",
                "order": 24
            },
            {
                "code": "AP-QAccConSel-0b6e6d5c-32df-4e47-bd66-d0c16b065ca1",
                "description": "Quote Accepted - Contractor Selected-f97dcb28-b853-4870-9411-80d3e210caa5",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100021,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Quote Accepted - Contractor Selected-f97dcb28-b853-4870-9411-80d3e210caa5",
                "order": 25
            },
           {
                "code": "AP-QAccConSel-ca33919b-6b75-4c3b-b636-2137c94b8cb7",
                "description": "Quote Accepted - Contractor Selected-705a808e-eeaf-4892-b987-144e7d383e52",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100037,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Quote Accepted - Contractor Selected-705a808e-eeaf-4892-b987-144e7d383e52",
                "order": 26
            },
           {
                "code": "AP-QAccConSel-3f582cb0-3256-4133-9a60-2c705c62ccdc",
                "description": "Quote Accepted - Contractor Selected-800dec7a-717d-4e52-ac0a-03e9b9246cd0",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100053,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Quote Accepted - Contractor Selected-800dec7a-717d-4e52-ac0a-03e9b9246cd0",
                "order": 27
            },
             {
                "code": "AP-QAccConSel-70545570-806b-4577-84b7-fbabc964fb07",
                "description": "Quote Accepted - Contractor Selected-b2611c78-ece6-4b38-8a26-bfbb551e6e5b",
                "sequenceNumber": 1,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100069,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Quote Accepted - Contractor Selected-b2611c78-ece6-4b38-8a26-bfbb551e6e5b",
                "order": 28
            },
            {
                "code": "AS",
                "description": "Awaiting Spares",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 5000001002,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Spares",
                "order": 29
            },
             {
                "code": "AP-Assigned-5e46f6a5-0df9-419d-8c7e-b2b90e19664b",
                "description": "Assigned to Contractor-47c2265e-ad34-4111-8751-334fe4e48d09",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107742100006,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Assigned to Contractor-47c2265e-ad34-4111-8751-334fe4e48d09",
                "order": 30
            },
             {
                "code": "AP-Assigned-172b9158-ed4f-4ff5-9e34-19f93fc6cc0a",
                "description": "Assigned to Contractor-be92b984-3c80-4910-b5d2-010834a88cf9",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100022,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Assigned to Contractor-be92b984-3c80-4910-b5d2-010834a88cf9",
                "order": 31
            },
             {
                "code": "AP-Assigned-9906de1f-9113-42ab-82f9-00f16084ac2c",
                "description": "Assigned to Contractor-c938c2d9-792b-478f-98a0-ba1523018ece",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100038,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Assigned to Contractor-c938c2d9-792b-478f-98a0-ba1523018ece",
                "order": 32
            },
             {
                "code": "AP-Assigned-e60c2a5f-961a-40d3-9055-641f21c1681d",
                "description": "Assigned to Contractor-4ce486fd-316f-4401-9988-751379deb8cc",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100054,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Assigned to Contractor-4ce486fd-316f-4401-9988-751379deb8cc",
                "order": 33
            },
            {
                "code": "AP-Assigned-fce23a25-6fd1-445f-9280-a33fdf607f9c",
                "description": "Assigned to Contractor-2bba5556-ffa9-47d6-a38f-1fc92bb972a2",
                "sequenceNumber": 2,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100070,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Assigned to Contractor-2bba5556-ffa9-47d6-a38f-1fc92bb972a2",
                "order": 34
            },
            {
                "code": "IP",
                "description": "In Progress",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 5000001003,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "In Progress",
                "order": 35
            },
            {
                "code": "AP-ContTrav-fbe1b512-2100-4533-96a7-ebe96d3102bf",
                "description": "Contractor - Traveling-ef90ab92-80b6-4fa3-9060-86e2ef9776a3",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107742100007,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Traveling-ef90ab92-80b6-4fa3-9060-86e2ef9776a3",
                "order": 36
            },
           {
                "code": "AP-ContTrav-677cd088-57fb-44fb-b324-631a149235aa",
                "description": "Contractor - Traveling-b75d3786-7ac8-4d17-8a89-5f251e45dc8d",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100023,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Traveling-b75d3786-7ac8-4d17-8a89-5f251e45dc8d",
                "order": 37
            },
            {
                "code": "AP-ContTrav-b3bce156-70c6-4084-b11a-08087d057660",
                "description": "Contractor - Traveling-f2ed09f1-2d32-481f-b7f7-55efbbf63954",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100039,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Traveling-f2ed09f1-2d32-481f-b7f7-55efbbf63954",
                "order": 38
            },
             {
                "code": "AP-ContTrav-5c3d7892-c6a7-4f22-bf5f-8b785cefffad",
                "description": "Contractor - Traveling-d8ca5e29-7674-4478-a3eb-e0449b4ebe36",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100055,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Traveling-d8ca5e29-7674-4478-a3eb-e0449b4ebe36",
                "order": 39
            },
             {
                "code": "AP-ContTrav-38f86940-27bc-4c89-94bc-bbc312ee0810",
                "description": "Contractor - Traveling-87a6fa18-a96d-4c0e-9f73-a277b6fd877a",
                "sequenceNumber": 3,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100071,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Traveling-87a6fa18-a96d-4c0e-9f73-a277b6fd877a",
                "order": 40
            },
             {
                "code": "AF",
                "description": "Complete/Awaiting Feedback",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 5000001004,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Complete/Awaiting Feedback",
                "order": 41
            },
             {
                "code": "AP-ContIP-f1e5cb69-e32f-4fb1-b788-2d92891bbc3a",
                "description": "Contractor - In Progress-0a3194da-594e-4a5e-bb4e-b718c4ecce9a",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107743100008,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - In Progress-0a3194da-594e-4a5e-bb4e-b718c4ecce9a",
                "order": 42
            },
           {
                "code": "AP-ContIP-b174aadb-32df-4a74-abf1-730fc9a700ad",
                "description": "Contractor - In Progress-20f950f9-4c53-4da5-b8f5-bc9c9853720a",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100024,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - In Progress-20f950f9-4c53-4da5-b8f5-bc9c9853720a",
                "order": 43
            },
            {
                "code": "AP-ContIP-d9f53c9b-e5db-4235-bb35-38502edf59d5",
                "description": "Contractor - In Progress-fe20313e-35a7-48de-9d66-27c4028e77ab",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100040,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - In Progress-fe20313e-35a7-48de-9d66-27c4028e77ab",
                "order": 44
            },
           {
                "code": "AP-ContIP-7b2706e1-0399-4365-a7ed-cee28786d081",
                "description": "Contractor - In Progress-a066b9e2-560f-4836-a4d8-6b056078834b",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100056,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - In Progress-a066b9e2-560f-4836-a4d8-6b056078834b",
                "order": 45
            },
          {
                "code": "AP-ContIP-f80f8ad9-d060-4bc8-83a8-94c76307eb8f",
                "description": "Contractor - In Progress-cf677bf1-76a6-4f43-add8-f4dea0e46676",
                "sequenceNumber": 4,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100072,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - In Progress-cf677bf1-76a6-4f43-add8-f4dea0e46676",
                "order": 46
            },
          {
                "code": "AC",
                "description": "Complete/Awaiting Costs",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 5000001005,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Complete/Awaiting Costs",
                "order": 47
            },
             {
                "code": "AP-ContPaused-a5814efe-d3f4-47e8-a338-cc4bcf541746",
                "description": "Contractor - Paused-33b89018-79e6-44f0-afc4-4ccdd19aaed5",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107743100009,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Paused-33b89018-79e6-44f0-afc4-4ccdd19aaed5",
                "order": 48
            },
             {
                "code": "AP-ContPaused-54a14037-cbc0-4a90-99c6-bf94a3127535",
                "description": "Contractor - Paused-6c4954dd-27a7-4e97-905a-600f1a4d112f",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100025,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Paused-6c4954dd-27a7-4e97-905a-600f1a4d112f",
                "order": 49
            },
             {
                "code": "AP-ContPaused-a489b6ef-c343-4a46-8153-f7819ce46a0e",
                "description": "Contractor - Paused-36e16322-e592-4842-ab2b-b6adbbfe4f67",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100041,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Paused-36e16322-e592-4842-ab2b-b6adbbfe4f67",
                "order": 50
            },
             {
                "code": "AP-ContPaused-70af28a6-e46d-44e8-bfca-69377e7f1e99",
                "description": "Contractor - Paused-a314fab4-3a0d-4709-9d5f-718352893dd8",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100057,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Paused-a314fab4-3a0d-4709-9d5f-718352893dd8",
                "order": 51
            },
             {
                "code": "AP-ContPaused-71a78601-34cf-4c1c-85a4-6c278d7f02b1",
                "description": "Contractor - Paused-2825dc51-9686-4976-820e-a65887efa1d7",
                "sequenceNumber": 5,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100073,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Paused-2825dc51-9686-4976-820e-a65887efa1d7",
                "order": 52
            },
             {
                "code": "AP-ContDone-14ffd47f-09ef-4910-a778-f57477bc590c",
                "description": "Contractor - Done-6cc44bab-46c7-4f52-8d15-511f6c99c133",
                "sequenceNumber": 6,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107743100010,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Done-6cc44bab-46c7-4f52-8d15-511f6c99c133",
                "order": 53
            },
             {
                "code": "AP-ContDone-57b92f40-e874-4e7a-a3cc-6b416e2f4bc9",
                "description": "Contractor - Done-24ed2c70-aca9-4b30-b419-ee09706b90d7",
                "sequenceNumber": 6,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107749100026,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Done-24ed2c70-aca9-4b30-b419-ee09706b90d7",
                "order": 54
            },
             {
                "code": "AP-ContDone-8948967e-d0b9-4886-8f1d-833467cb4881",
                "description": "Contractor - Done-4722f493-c865-4a68-9d68-e9d6b755b0c7",
                "sequenceNumber": 6,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107753100042,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Done-4722f493-c865-4a68-9d68-e9d6b755b0c7",
                "order": 55
            },
             {
                "code": "AP-ContDone-bb75ee82-b09c-4a7d-9075-03e6795da142",
                "description": "Contractor - Done-f0952552-b1f8-4eed-bb21-b3aba974bc6c",
                "sequenceNumber": 6,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107758100058,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Done-f0952552-b1f8-4eed-bb21-b3aba974bc6c",
                "order": 56
            },
             {
                "code": "AP-ContDone-3d4c4e87-5418-4e04-89c6-bc936927aa4f",
                "description": "Contractor - Done-62b6257b-2139-46b3-a886-b83550ba8cda",
                "sequenceNumber": 6,
                "baseStatus": "Approved",
                "applyStatusRestrictions": false,
                "id": 1720107771100074,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Contractor - Done-62b6257b-2139-46b3-a886-b83550ba8cda",
                "order": 57
            },
            {
                "code": "CP",
                "description": "Completed",
                "sequenceNumber": 0,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 12,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Completed",
                "order": 58
            },
            {
                "code": "CP-WorkSOff-aebb3bd5-3e35-4bea-a990-060f5a39b200",
                "description": "Work Signed Off-1bc327bd-5b72-4862-839e-45716c47596c",
                "sequenceNumber": 1,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107743100011,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Work Signed Off-1bc327bd-5b72-4862-839e-45716c47596c",
                "order": 59
            },
            {
                "code": "CP-WorkSOff-3e39d1fc-eb32-4e41-acd8-2d38b8287894",
                "description": "Work Signed Off-738fd938-f43f-403e-96ef-b4183f4c71a8",
                "sequenceNumber": 1,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107749100027,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Work Signed Off-738fd938-f43f-403e-96ef-b4183f4c71a8",
                "order": 60
            },
            {
                "code": "CP-WorkSOff-fcaec3a7-1bf0-41d6-805d-4fe34ab54592",
                "description": "Work Signed Off-4989d280-3a68-4d4d-a145-4699ede037c0",
                "sequenceNumber": 1,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107753100043,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Work Signed Off-4989d280-3a68-4d4d-a145-4699ede037c0",
                "order": 61
            },
            {
                "code": "CP-WorkSOff-0ad305da-dfe2-469e-bd89-0dc66057d201",
                "description": "Work Signed Off-ded5726c-958a-4dad-adb1-679d139bf561",
                "sequenceNumber": 1,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107758100059,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Work Signed Off-ded5726c-958a-4dad-adb1-679d139bf561",
                "order": 62
            },
            {
                "code": "CP-WorkSOff-1a7ba6af-4cd2-430c-8a83-a0156de6f347",
                "description": "Work Signed Off-58b6ca8a-63bd-4a82-bc3c-f02df362862b",
                "sequenceNumber": 1,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107771100075,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Work Signed Off-58b6ca8a-63bd-4a82-bc3c-f02df362862b",
                "order": 63
            },
            {
                "code": "CP-AwaitInv-72d86f70-4d5d-4fa0-b7ea-0ca88dfee2cd",
                "description": "Awaiting Invoice-9ac2b3f5-8fec-465f-b3e3-30e8def9e514",
                "sequenceNumber": 2,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107743100012,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Invoice-9ac2b3f5-8fec-465f-b3e3-30e8def9e514",
                "order": 64
            },
            {
                "code": "CP-AwaitInv-4a86a4f3-a104-4b15-9a75-19cc18a3a9c3",
                "description": "Awaiting Invoice-0e4c9703-fb53-4d41-af46-9a2836aa961d",
                "sequenceNumber": 2,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107749100028,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Invoice-0e4c9703-fb53-4d41-af46-9a2836aa961d",
                "order": 65
            },
             {
                "code": "CP-AwaitInv-af5fdb00-1f9d-4c69-adbc-030526dd7f9f",
                "description": "Awaiting Invoice-db3dca8b-081c-4c17-9345-059c2211e4d2",
                "sequenceNumber": 2,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107754100044,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Invoice-db3dca8b-081c-4c17-9345-059c2211e4d2",
                "order": 66
            },
             {
                "code": "CP-AwaitInv-dce7f3d3-f2f7-4abd-98ce-cac19346e7a8",
                "description": "Awaiting Invoice-641a5761-784a-477f-839f-f7f53dcd6e11",
                "sequenceNumber": 2,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107758100060,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Invoice-641a5761-784a-477f-839f-f7f53dcd6e11",
                "order": 67
            },
             {
                "code": "CP-AwaitInv-7aee7c7e-4e09-4db4-a032-33cf0f75cba9",
                "description": "Awaiting Invoice-85f1a8c6-6194-4af3-be95-7ed777d0ed52",
                "sequenceNumber": 2,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107771100076,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Awaiting Invoice-85f1a8c6-6194-4af3-be95-7ed777d0ed52",
                "order": 68
            },
             {
                "code": "CP-RecInv-efb6bbca-05a6-4cc0-80c0-dbb181c49439",
                "description": "Invoice Received-4350273f-f23f-454f-9e0c-62e312a6bc98",
                "sequenceNumber": 3,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107743100013,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Received-4350273f-f23f-454f-9e0c-62e312a6bc98",
                "order": 69
            },
            {
                "code": "CP-RecInv-5ea76eef-dac1-4905-b496-5cc25ddecd32",
                "description": "Invoice Received-2db73fca-454f-48a8-9a6a-57642e6d3452",
                "sequenceNumber": 3,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107749100029,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Received-2db73fca-454f-48a8-9a6a-57642e6d3452",
                "order": 70
            },
            {
                "code": "CP-RecInv-b31c3054-c4f6-4ac3-ad43-e6978b28635e",
                "description": "Invoice Received-a26ab547-4dde-4542-8da3-8222f2fcee3d",
                "sequenceNumber": 3,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107754100045,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Received-a26ab547-4dde-4542-8da3-8222f2fcee3d",
                "order": 71
            },
             {
                "code": "CP-RecInv-d4ff5f9f-57c6-4fab-a1cd-5860eca858f5",
                "description": "Invoice Received-beaed350-c4a6-458d-9ef1-2fc9d4f1a297",
                "sequenceNumber": 3,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107758100061,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Received-beaed350-c4a6-458d-9ef1-2fc9d4f1a297",
                "order": 72
            },
             {
                "code": "CP-RecInv-a924ccb8-2191-4091-a60e-61e2a5adffed",
                "description": "Invoice Received-4d03e127-ec0a-4163-991b-aa8f6089e71a",
                "sequenceNumber": 3,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107771100077,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Received-4d03e127-ec0a-4163-991b-aa8f6089e71a",
                "order": 73
            },
             {
                "code": "CP-RevInv-6274b6d0-0d99-4ae1-849b-2d6a9ab69733",
                "description": "Invoice Review-433c9a09-1b27-42ba-9395-db8b6a4d08d2",
                "sequenceNumber": 4,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107743100014,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Review-433c9a09-1b27-42ba-9395-db8b6a4d08d2",
                "order": 74
            },
            {
                "code": "CP-RevInv-4e381548-86be-4819-bff5-cb3af2be0541",
                "description": "Invoice Review-0a78bfdb-f489-4920-8807-b4a3d9e7cb2b",
                "sequenceNumber": 4,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107749100030,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Review-0a78bfdb-f489-4920-8807-b4a3d9e7cb2b",
                "order": 75
            },
            {
                "code": "CP-RevInv-4787fd57-25f2-470c-9427-7262092639e9",
                "description": "Invoice Review-44e6219c-e985-4e78-9c3f-ad3a7bea703e",
                "sequenceNumber": 4,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107754100046,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Review-44e6219c-e985-4e78-9c3f-ad3a7bea703e",
                "order": 76
            },
           {
                "code": "CP-RevInv-8039bfd2-ff05-4a07-88d1-597bc29aef69",
                "description": "Invoice Review-9b865096-1fa2-409a-9070-4990f2e9770c",
                "sequenceNumber": 4,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107759100062,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Review-9b865096-1fa2-409a-9070-4990f2e9770c",
                "order": 77
            },
            {
                "code": "CP-RevInv-8e034e2c-7f54-472f-bfbd-3b4b128721a7",
                "description": "Invoice Review-bbd2f85a-8e78-4aae-a2d6-df9ef2b0958e",
                "sequenceNumber": 4,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107772100078,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Review-bbd2f85a-8e78-4aae-a2d6-df9ef2b0958e",
                "order": 78
            },
            {
                "code": "CP-InvP-02bc5876-ed4e-4d33-953e-8766f902b0d5",
                "description": "Invoice Approved-d710b413-07ef-43ae-a065-b5c365112dc4",
                "sequenceNumber": 5,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107743100015,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Approved-d710b413-07ef-43ae-a065-b5c365112dc4",
                "order": 79
            },
             {
                "code": "CP-InvP-9741fb53-a478-4af9-8647-10c7e45608ef",
                "description": "Invoice Approved-493c1a87-0da7-46bf-9ba7-55c5ad3ea331",
                "sequenceNumber": 5,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107749100031,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Approved-493c1a87-0da7-46bf-9ba7-55c5ad3ea331",
                "order": 80
            },
           {
                "code": "CP-InvP-6188e8e7-d3c9-41cb-b16f-e58b67aef511",
                "description": "Invoice Approved-01f0f077-7cc9-41a6-8531-693b40eba1c4",
                "sequenceNumber": 5,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107754100047,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Approved-01f0f077-7cc9-41a6-8531-693b40eba1c4",
                "order": 81
            },
             {
                "code": "CP-InvP-e71cebfa-a230-4a1e-8907-7d773a58902e",
                "description": "Invoice Approved-bc8aa43c-418e-4619-b19c-c6b418cc1f63",
                "sequenceNumber": 5,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107759100063,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Approved-bc8aa43c-418e-4619-b19c-c6b418cc1f63",
                "order": 82
            },
          {
                "code": "CP-InvP-eb79ae66-a0d8-4758-a412-f03cba41b60d",
                "description": "Invoice Approved-19ca1510-b501-4384-9106-281b071aee58",
                "sequenceNumber": 5,
                "baseStatus": "Completed",
                "applyStatusRestrictions": false,
                "id": 1720107772100079,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Invoice Approved-19ca1510-b501-4384-9106-281b071aee58",
                "order": 83
            },
           {
                "code": "CL",
                "description": "Closed",
                "sequenceNumber": 0,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 13,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Closed",
                "order": 84
            },
             {
                "code": "CL-Paid-8a1f0a5a-b455-4faa-8f89-ab7d003cb6e3",
                "description": "Paid-bb8a9fa0-3cee-4951-ad1d-f8bd0bb06bc7",
                "sequenceNumber": 1,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 1720107743100016,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Paid-bb8a9fa0-3cee-4951-ad1d-f8bd0bb06bc7",
                "order": 85
            },
             {
                "code": "CL-Paid-a7d9f4df-088b-49ee-a3b6-b708c4f8b236",
                "description": "Paid-a0ca04c1-fedd-42cc-96e1-d2a61487d8ae",
                "sequenceNumber": 1,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 1720107749100032,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Paid-a0ca04c1-fedd-42cc-96e1-d2a61487d8ae",
                "order": 86
            },
            {
                "code": "CL-Paid-c47a66cd-7e73-4654-aacc-e745b8a0f919",
                "description": "Paid-47eb0fb5-a2cb-4e08-9ae6-67683f251576",
                "sequenceNumber": 1,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 1720107754100048,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Paid-47eb0fb5-a2cb-4e08-9ae6-67683f251576",
                "order": 87
            },
           {
                "code": "CL-Paid-c967033c-a9ae-42ae-a3be-b28993a0c142",
                "description": "Paid-6fd0b671-dfe9-4c42-a7ef-2e57b3a760e7",
                "sequenceNumber": 1,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 1720107759100064,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Paid-6fd0b671-dfe9-4c42-a7ef-2e57b3a760e7",
                "order": 88
            },
           {
                "code": "CL-Paid-104639bf-99af-4498-94eb-937d4620dc00",
                "description": "Paid-2a3a7795-cb40-4628-b350-660bc84ccd50",
                "sequenceNumber": 1,
                "baseStatus": "Closed",
                "applyStatusRestrictions": false,
                "id": 1720107772100080,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Paid-2a3a7795-cb40-4628-b350-660bc84ccd50",
                "order": 89
            },
         {
                "code": "CA",
                "description": "Cancelled",
                "sequenceNumber": 0,
                "baseStatus": "Cancelled",
                "applyStatusRestrictions": false,
                "id": 14,
                "version": 1,
                "additionalInfo": {
                    "class": "DomainDynamicRecord"
                },
                "translation_description": "Cancelled",
                "order": 90
            }

    ],
    "sla": [
        {
            "id": "1001",
            "code": "LBU-3ea54076-31d5-4ef4-8a18-a1589-2234",
            "description": "Pump Breakdown Breakdowns",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "version": 1,
                    "code": "LBU-3ea54076-31d5-4ef4-8a18-a1589-2234",
                    "description": "something",
                    "start_status": "AA",
                    "end_status": "AP",
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": "AL",
                    "end_status": "AS",
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": "IP",
                    "end_status": "AC",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": "AP",
                    "end_status": "CP",
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
        },
        {
            "id": "1002",
            "code": "SLA-2",
            "description": "Banana",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "version": 1,
                    "code": "Response Time",
                    "description": "something",
                    "start_status": "AA",
                    "end_status": "AP",
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": "AL",
                    "end_status": "AS",
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": "IP",
                    "end_status": "AC",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": "AP",
                    "end_status": "CP",
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
const data4 = {
    "currentStatus": 11,
    "statuses": [
        {
            "code": "AA",
            "description": "Awaiting Approval",
            "sequenceNumber": 0,
            "baseStatus": "AwaitingApproval",
            "applyStatusRestrictions": false,
            "id": 10,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Approval"
        },
        {
            "code": "*1019",
            "description": "To be Inspected",
            "sequenceNumber": 1,
            "baseStatus": "AwaitingApproval",
            "applyStatusRestrictions": false,
            "id": 5000001019,
            "version": 2,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "To be Inspected"
        },
        {
            "code": "AP",
            "description": "Approved",
            "sequenceNumber": 0,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 11,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Approved"
        },
        {
            "code": "AL",
            "description": "Awaiting Labour",
            "sequenceNumber": 1,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001001,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Labour"
        },
        {
            "code": "AS",
            "description": "Awaiting Spares",
            "sequenceNumber": 2,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001002,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Awaiting Spares"
        },
        {
            "code": "IP",
            "description": "In Progress",
            "sequenceNumber": 3,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001003,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "In Progress"
        },
        {
            "code": "AF",
            "description": "Complete/Awaiting Feedback",
            "sequenceNumber": 4,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001004,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Complete/Awaiting Feedback"
        },
        {
            "code": "AC",
            "description": "Complete/Awaiting Costs",
            "sequenceNumber": 5,
            "baseStatus": "Approved",
            "applyStatusRestrictions": false,
            "id": 5000001005,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Complete/Awaiting Costs"
        },
        {
            "code": "CP",
            "description": "Completed",
            "sequenceNumber": 0,
            "baseStatus": "Completed",
            "applyStatusRestrictions": false,
            "id": 12,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Completed"
        },
        {
            "code": "CL",
            "description": "Closed",
            "sequenceNumber": 0,
            "baseStatus": "Closed",
            "applyStatusRestrictions": false,
            "id": 13,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Closed"
        },
        {
            "code": "CA",
            "description": "Cancelled",
            "sequenceNumber": 0,
            "baseStatus": "Cancelled",
            "applyStatusRestrictions": false,
            "id": 14,
            "version": 1,
            "additionalInfo": {
                "class": "DomainDynamicRecord"
            },
            "translation_description": "Cancelled"
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
                    "version": 1,
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 10,
                    "end_status": 11,
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 5000001001,
                    "end_status": 5000001002,
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 5000001003,
                    "end_status": 5000001005,
                    "progress": 50,
                    "status": "active",
                    "duration": "30:00",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": 11,
                    "end_status": 12,
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
        },
        {
            "id": "1002",
            "code": "SLA-2",
            "description": "Pump Build",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "version": 1,
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 10,
                    "end_status": 11,
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 5000001001,
                    "end_status": 5000001002,
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 5000001003,
                    "end_status": 5000001005,
                    "progress": 50,
                    "status": "active",
                    "duration": "30:00",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": 11,
                    "end_status": 12,
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
        },
        {
            "id": "1003",
            "code": "SLA-3",
            "description": "Pump Finish",
            "duration": "99%",
            "measurements": [
                {
                    "id": "1001",
                    "version": 1,
                    "code": "Response Time",
                    "description": "something",
                    "start_status": 10,
                    "end_status": 11,
                    "progress": 81,
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
                    "version": 1,
                    "code": "Inspection",
                    "description": "something else",
                    "start_status": 5000001001,
                    "end_status": 5000001002,
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
                    "version": 1,
                    "code": "Maintenance",
                    "description": "something",
                    "start_status": 5000001003,
                    "end_status": 5000001005,
                    "progress": 50,
                    "status": "active",
                    "duration": "30:00",
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
                    "version": 1,
                    "code": "Completion",
                    "description": "something",
                    "start_status": 11,
                    "end_status": 12,
                    "progress": 101,
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



export {data1, data2, data3, data4}