pragma solidity ^0.4.16;

contract decentralized {

	struct Player {
		bytes32 name;
		address wallet;
	}

	Player[] public playerList;
	address public owner;
	uint public ptr = 0;

	/* Constructor when first deploy contract */
	function decentralized() { 
		owner = msg.sender;	
	}


	/* Adds player to array of Player structs */
	function addPlayer(bytes32 playerName, address playerWallet) {
		playerList[ptr].name = playerName;
		playerList[ptr].wallet = playerWallet;
		ptr++; //make room for next person
	}

	/* Collects ether from player */
	function collect() payable {

		for( uint i = 0; i < playerList.length; i++) {
	
			playerList[i].wallet.transfer(5); //each player sends 5 ether
		}
	}


	/* Pay ether to winner */
	function pay(bytes32 name) {
		
		address winner = findWinner(name); //find wallet address of winner

		//transfer winnings to winning player
		winner.transfer(10);  

	}

	/* Find winner of game */
	function findWinner(bytes32 name) constant returns (address) {
		
		for( uint i = 0; i < playerList.length; i++) {
			
			if( playerList[i].name == name ) {
				
				return playerList[i].wallet;
			}
		}
	}
}
