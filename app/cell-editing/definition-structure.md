# Definition structure

```js
const def = {
    name: "my-context",
    fields: {
        field1: {
            dataType: "boolean",
            default: true,
            
            conditionalDefaults: [
                {
                    conditionExpr: "person.firstName == 'John'",
                    value: false
                },
                {
                    conditionExpr: "person.firstName == 'Jane'",
                    value: true
                }
            ]
        },
        field2: {
            dataType: "string",
            default: "unassigned",
            
            conditionalDefaults: {
                conditionalExptr: "person.firstName == 'John'",
                true_value: "Inactive",
                false_value: "Active"
            },
            
            defaultValidations: {
                required: {
                    required: true,
                    error: "Field 2 is required"
                },
                
                maxLength: {
                    value: 12,
                    error: "Value is too long"
                }
            },
            
            conditionalValidation: [
                {
                    conditionalExpr: "person.firstName == 'Jane'",
                    rules: {
                        required: {
                            required: false
                        }
                    }
                }
            ]
        },
        collectionField: {
            dataType: "string",
            default: "#{values}",
            display_path: "title",
            value_path: "value"
        }
    }
}

```