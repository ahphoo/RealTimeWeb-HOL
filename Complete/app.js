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
/*
if (typeof web !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers, in this case its localhost
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var fs = require('fs');
var code = fs.readFileSync('./contracts/Bank.sol').toString();
//var code = fs.readFileSync('./contracts/decentralized.sol').toString();
var solc = require('solc');
var compiledCode = solc.compile(code);

//Deploy the contract 
abiDefinition = JSON.parse(compiledCode.contracts[':Bank'].interface);
//abiDefinition = JSON.parse(compiledCode.contracts[':decentralized'].interface);
GameContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':Bank'].bytecode;
//byteCode = compiledCode.contracts[':decentralized'].bytecode;
deployedContract = GameContract.new( {data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
contractInstance = GameContract.at(deployedContract.address);
web3.eth.defaultAccount=web3.eth.accounts[0]; //set default account 



//contractInstance.forward(web3.eth.defaultAccount); */
var web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":false,"inputs":[],"name":"payBlack","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payWhite","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getContractCreationValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"player_two","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]');
VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at('0x41db9dff8a029e426cd879f7bafcfad4ae559b3a');


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
		contractInstance.payBlack();
		
	}
	else if(msg === 'Game over, Black is in checkmate.') {
		//Pay player 2
		contractInstance.payWhite();
	}
	else if(msg === 'Game over, drawn position') {
		//Refund ether to player 1 and player 2
		contractInstance.kill();
	}
    });
});
