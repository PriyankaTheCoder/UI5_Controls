JSONControl is a custom control which aims to display JSON text in a human-readable and flexible way. 

1. This control validates a json string. If you pass an invalid json string, the UI will show you the same.
2. It supports expansion and collapse of individual JSON key-value pair nodes and also allows for easy viewing of text.
3. You can add or delete particular node - which involves array, object or single entry.
4. You can change the key/value from the UI by double-clicking on a particular text.
5. Save control will save key/value text if changed or added
6. Copy control will open a text area from which you can copy the json string.
7. Values of the json string accepts 3 datatypes: string, boolean and number whereas keys can accept only string. Even if 
    pass some other datatypes to keys it will automatically be converted to string.

This custom control has 3 properties:

1. `json`       (type 'string')  : The json string you want to parse to UI as an object
2. `editable`   (type 'boolean') : This describes whether the JSON control can support editing or not.

                If editable = 'true' you can add, delete or change the JSON object
                
                If editable = 'false' you can only use the expand,collapse and copy functionality
                
      Default : `false`
                
3. `collapsible` (type boolean) : This describes whether the nodes can collapse/expand
                
                If collapsible = 'true' you can collapse/expand a node
          
                If collapsible = 'false' you can use add,delete or change functionality but will 
                                  not be able to expand/collapse a node. 
      Default : `false`
