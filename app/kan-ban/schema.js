export const schema = {
    "id": "kanban_drop",

    "allow_drop": {
        "steps": {
            "start": {
                "type": "condition",
                "args": {
                    "condition": "$item.target.id == 2",
                    "target": "$item.result"
                }
            }
        }
    },

    "on_drop": {
        "steps": {
            "start": {
                "type": "console",
                "action": "log",
                "args": {
                    "messages": ["drop done, id: ", "$item.dragElement.dataset.id", '"', "$item.model.code", '"', "to target id: ", "$item.target.id"]
                }
            }
        }
    }
}