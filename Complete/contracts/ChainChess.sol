pragma solidity ^0.4.16;

contract ChainChess {

	address white;
	address black;
	uint pot; // original endowment

	/* Fall-back function */
	function() payable
	{
		pot += msg.value;
	}

	function ChainChess(address player2) public payable
	{
		white = msg.sender; 		
		black = player2;
		pot = msg.value;  	// the starting pot for chess game
	}

	function payWhite() payable
	{
		white.transfer(pot);
		pot -= pot;
	}

	function payBlack() payable
	{
		black.transfer(pot);
		pot -= pot;
	}

	function getPot() constant returns (uint) // returns the total ether held by the contract
	{										              		
		return pot;  
	}

	/**********
	  Return ether to both players
	 **********/

	function kill() payable
	{ 
		if (msg.sender == white)
		{
			suicide(white);  // kills this contract and sends remaining funds back to creator
		}
		if (msg.sender == black)
		{
			suicide(black);
		}
	}
}
