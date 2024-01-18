export const inputStep = {
    "type": "perform",
    "action": "type_text",
    "args": {
        "query": "",
        "value": ""
    }
}

export const clickStep = {
    "type": "perform",
    "action": "click",
    "args": {
        "query": ""
    }
}

export const dragStep = {
    "type": "perform",
    "action": "drag",
    "args": {
        "query": "",
        "target": "",
        "x": 0,
        "y": 0
    }
}

export const process = {
    "id": "",

    "main": {
        "steps": {
            "start": {
                "type": "perform",
                "action": "navigate",
                "args": {
                    "url": "${state.server}"
                },
                "next_step": "step_0"
            }
        }
    }
}