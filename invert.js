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
				    msg.payload = false;
				} else {
					msg.payload = true;
				}
			} else if (typeof msg.payload === 'number' || typeof msg.payload === 'boolean') {
				if (msg.payload) {
					msg.payload = false;
				} else {
					msg.payload = true;
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
		this.inputCount = n.inputCount;
		this.values = {};

		this.on('input', function(msg){

			//add or replace
			if (node.values[msg.topic]) {
				node.values[msg.topic] = msg.payload;
			} else if (Object.keys(node.values).length < node.inputCount) {
				node.values[msg.topic] = msg.payload;
			}

			var keys = Object.keys(node.values);
			for (var k in Object.keys(node.values)) {
				if (node.values[keys[k]]) {
					node.send({
						topic: node.topic,
						payload : true
					});
					return;
				}
			}
			node.send({
				topic:node.topic,
				payload: false
			})
		});
	}
	RED.nodes.registerType("Or", or);

	function and(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		this.topic = n.topic;
		this.inputCount = n.inputCount;
		this.values = {};

		this.on('input', function(msg){

			var keys = Object.keys(node.values);
			if (keys.indexOf(msg.topic) != -1) {
				node.values[msg.topic] = msg.payload;
			} else if (Object.keys(node.values).length < node.inputCount) {
				node.values[msg.topic] = msg.payload
			}

			keys = Object.keys(node.values);
			if (keys.length == node.inputCount) {
				for (var k in Object.keys(node.values)) {
					if (!node.values[keys[k]]) {
						node.send({
							topic: node.topic,
							payload: false
						});
						return;
					}
				}
				node.send({
					topic: node.topic,
					payload: true
				});
			}
		});
	}
	RED.nodes.registerType("And", and);

	function equals(n) {
		RED.nodes.createNode(this,n);
		this.topic = n.topic;
		this.values = {};

		var node = this;

		this.on('input', function(msg){
			if (Object.keys(node.values).length < 2) {
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
				payload: false
			};

			if (Object.keys(node.values).length == 2) {
				if (node.values[Object.keys(node.values)[0]] == node.values[Object.keys(node.values)[1]]) {
					m.payload = true;
				}

				node.send(m);
			}
		});
	}
	RED.nodes.registerType("Equals", equals);

}