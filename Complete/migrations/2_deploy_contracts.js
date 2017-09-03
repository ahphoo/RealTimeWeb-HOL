var decentralised = artifacts.require("./decentralised.sol");
module.exports = function(deployer) {
 	deployer.deploy(decentralised, {gas: 290000}); 
};
