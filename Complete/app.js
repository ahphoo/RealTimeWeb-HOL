/*// Import the page's CSS. Webpack will know what to do with it.
import "/stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Game contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Game abstraction. We will use this abstraction
 * later to create an instance of the Game contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 *

import decentralized_artifacts from '/build/contracts/decentralized.json'


var decentralized = contract(decentralized_artifacts);

window. */


var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

/* Set up web3 library */
var Web3 = require('web3');
if (typeof web !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers, in this case its localhost
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:3000"));
}
var fs = require('fs');
var code = fs.readFileSync('./contracts/decentralized.sol').toString();
var solc = require('solc');
var compiledCode = solc.compile(code);

//Deploy the contract 
abiDefinition = JSON.parse(compiledCode.contracts[':decentralized'].interface);
/*GameContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':decentralized'].bytecode;
deployedContract = GameContract.new( {data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
contractInstance = GameContract.at(deployedContract.address);
contractInstance.decentralized(); //invoke constructor

//Add player1 and player2 names and wallets 
contractInstance.addPlayer('player1', 0x6760e300b57a4ddf2362056c711781655b9d64fc);
contractInstance.addPlayer('player2', 0xc4fb920eb5089070b82c5133d12ed0a78c85cc37);
*/


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});

io.on('connection', function(socket) {
    console.log('new connection');
    
    socket.on('move', function(msg) {
       socket.broadcast.emit('move', msg); 
    });

    socket.on('status', function(msg) {
    	socket.broadcast.emit('status',msg);
	console.log(msg);
	if(msg === 'Game over, White is in checkmate.') {
		//Pay player 1
		contractInstance.pay('player1');
	}
	else if(msg === 'Game over, Black is in checkmate.') {
		//Pay player 2
		contractInstance.pay('player2');
	}
	else if(msg === 'Game over, drawn position') {
		//Refund ether to player 1 and player 2
		contractInstance.refund();
	}
    });
});
