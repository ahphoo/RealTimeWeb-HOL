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
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var fs = require('fs');
var code = fs.readFileSync('./contracts/ChainChess.sol').toString();
var solc = require('solc');
var compiledCode = solc.compile(code);

/*Deploy the contract */
abiDefinition = JSON.parse(compiledCode.contracts[':ChainChess'].interface);
GameContract = web3.eth.contract(abiDefinition);
byteCode = compiledCode.contracts[':ChainChess'].bytecode;
deployedContract = GameContract.new( web3.eth.accounts[1], {data: byteCode, from: web3.eth.accounts[0], gas: 4700000});
deployedContract.address; //I don't know, maybe wait a cycle for contract to deploy?
contractInstance = GameContract.at(deployedContract.address);

web3.eth.defaultAccount=web3.eth.accounts[0]; //set default account 
web3.eth.sendTransaction( {from: web3.eth.accounts[0], to: deployedContract.address, value:1000000000000000000, gas: 290000} ); //send 1 ether

/*
var web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant":false,"inputs":[],"name":"payBlack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getPot","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"payWhite","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"player2","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]');
VotingContract = web3.eth.contract(abi);
// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = VotingContract.at('0x41db9dff8a029e426cd879f7bafcfad4ae559b3a'); */

/* Handle HTML request and provide path to default.html */
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

/* Display port number */
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
