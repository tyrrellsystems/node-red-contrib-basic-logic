# Basic Logic nodes for Node-RED

These nodes use topics to distinguish inputs to some basic logic functions.

## Invert

This node accepts messages with a payload containing the following input:

 - on/off
 - true/false
 - 1/0


it will output a 1 or a 0 which ever is the inverse of the input.

All other inputs will be forwarded as is

## Equals

This node takes the topics of the first 2 messages it receives (with 
different topics) and compares their payload. It does this by storing the 
payloads and updating them each time a relevent message arrives.

If the values are equal the it outputs a message with a payload of 1 and 0
if they do not.

## And



## Or
