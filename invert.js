/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";

	function invert(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		this.topic = n.topic;

		this.on('input', function(msg){
			if (typeof msg.payload === 'string') {
				if (msg.payload === 'on' || msg.payload === 'true') {
				    msg.payload = 0;
				} else {
					msg.payload = 1;
				}
			} else if (typeof msg.payload === 'number' || typeof msg.payload === 'boolean') {
				if (msg.payload) {
					msg.payload = 0;
				} else {
					msg.payload = 1;
				}
			}
			node.send(msg);
		});
	}
	RED.nodes.registerType("Invert", invert);

	function or(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		this.topic = n.topic;
		this.inputCount = n.inputs;
		this.values = {};

		this.on('input', function(msg){

			//add or replace
			if (node.values[msg.topic]) {
				node.values[msg.topic] = msg.payload;
			} else if (node.values.keys.length < node.inputCount) {
				node.values[msg.topic] = msg.payload;
			}

			for (k in node.values.keys) {
				if (node.values[k]) {
					node.send({
						topic: node.topic,
						payload : 1
					});
					return;
				}
			}
		});
	}
	RED.nodes.registerType("Or", or);

	function and(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		this.topic = n.topic;
		this.inputCount = n.inputs;
		this.values = {};

		this.on('input', function(msg){

		});
	}
	RED.nodes.registerType("And", and);

	function equals(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		this.topic = n.topic;
		this.values = {};

		this.on('input', function(msg){
			if (node.values.keys.length < 2) {
				node.values[msg.topic] = msg.payload;
			} else {
				if (node.values[msg.topic]) {
					node.values[msg.topic] = msg.payload;
				} else {
					//not found so ignore
					return;
				}
			}
			var m = {
				topic: node.topic,
				payload: 0
			};
			if (node.values[node.values.keys[0]] == node.values[node.values.keys[1]]) {
				m.payload = 1;
			}

			node.send(m);
		});
	}
	RED.nodes.registerType("Equals", equals);

}