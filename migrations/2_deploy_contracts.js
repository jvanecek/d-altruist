var DonationCampaign = artifacts.require('./DonationCampaign.sol');

module.exports = function(deployer) {
  deployer.deploy(DonationCampaign);
}
