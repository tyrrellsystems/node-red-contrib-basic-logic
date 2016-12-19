# Basic Logic nodes for Node-RED

These nodes use topics to distinguish inputs to some basic logic functions.

All nodes accepts messages with a payload containing the following input:

 - on/off
 - true/false
 - 1/0

## Invert

This node will output a 1 or a 0 which ever is the inverse of the input.

All other inputs will be forwarded as is

## Equals

This node takes the topics of the first 2 messages it receives (with 
different topics) and compares their payload. It does this by storing the 
payloads and updating them each time a relevent message arrives.

If the values are equal the it outputs a message with a payload of 1 and 0
if they do not.

If only one topic is recieved then there will be no output.

## And

Very similar to the Equals node, except both values have to be true not just
equal.

## Or

This node can handle more than 2 input messages, the number of messages is set
in the config UI. It will read messages with different topics until the max 
number is reached, then new topics will be ignored.

This node will output if any of the input messages are true. It start outputting
mesages even when the maximum number of inputs have not been reached.
