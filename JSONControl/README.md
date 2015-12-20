JSONControl is a custom control which aims to display JSON text in a human-readable and flexible way. 

1. It supports expansion and collapse of individual JSON key-value pair nodes and also allows for easy viewing of text.
2. You can add or delete particular node - which involves array, object or single entry.
3. You can change the key/value from the UI by double-clicking on a particular text.
4. Save control will save key/value text if changed or added
5. Copy control will open a text area from which you can copy the json string.

This custom control has 2 properties:

1. `json`       (type 'string')  : The json string you want to parse to UI as an object
2. `editable`   (type 'boolean') : This describes whether the JSON control can support editing or not.

                If editable = 'true' you can add, delete or change the JSON object
                
                If editable = 'false' you can only use the expand,collapse and copy functionality
                
3. `collapsible` (type boolean) : This describes whether the nodes can collapse/expand
                
                If collapsible = 'true' you can collapse/expand a node
          
                If collapsible = 'false' you can use add,delete or change functionality but will 
                                  not be able to expand/collapse a node. 
