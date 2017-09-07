pragma solidity ^0.4.16;

contract Receiver {
	function receive(address benefactor) payable
		returns (bool) {
			// Receives msg.value from msg.sender, in your case ForwardExample
			// But understands benefactor is the one who "paid".
			return true;
		}
}

contract ForwardExample {
	// Keep the target contract in, instead of passing it as a parameter
	// To forward function.
	Receiver receiver;

	function ForwardExample(address receiverAddr) {
		receiver = Receiver(receiverAddr);
	}

	function forward(address myOtherAddress) payable
		returns (bool) {
			// Pass on the whole ether received.
			bool successful = receiver.receive.value(msg.value)(myOtherAddress);
			if (!successful) throw;
			return true;
		}
}
