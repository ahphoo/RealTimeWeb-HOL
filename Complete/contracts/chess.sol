pragma solidity ^0.4.16;

contract chessContract {

	
	uint pot; //holds ether

	/* Constructor */ 		
	function chessContract(address player1, address player2) {
		//nothing here
	}

	/* Transfers ether from one player to another */
	function transfer(address to, address from, uint ethAmount) {
		
	}

	/* Refund player1 and player2 */
	function kill(address player1, address player2) {
		suicide(player1);
		suicide(player2);
	}

	/* Function that is called from JS application. Handles transactions */
	function gameOver(address player1, address player2, uint ethAmount, uint flag) {

		//If player1 won
		if(flag == 0) {
			transfer(player1, player2, ethAmount);
		}

		//If player2 won
		else if(flag == 1) {
			transfer(player2, player1, ethAmount);
		}
		
		//Refund both players
		else {
			kill(player1, player2);
		}
	}
}

contract 
