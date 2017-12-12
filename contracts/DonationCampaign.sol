pragma solidity ^0.4.11;

contract DonationCampaign {

  mapping(address => uint256) donationsReceivedByAddress;
  mapping(address => uint256) minimumWithdrawlByAddress;
  mapping(address => bool) hasOpenDonationCampaignByAddress;

  event LogDonationCampaignFallback();
  event LogDonation(address beneficiary, address donator, uint256 amount);
  event LogWithdrawl(address beneficiary, uint256 expectedMinimum, uint256 withdrawlAmount);

  function openNew(uint256 expectedFinalBalance) public {
    require(!hasOpenDonationCampaign());

    donationsReceivedByAddress[msg.sender] = 0;
    hasOpenDonationCampaignByAddress[msg.sender] = true;
    minimumWithdrawlByAddress[msg.sender] = expectedFinalBalance;
  }

  function donate(address beneficiaryAddress) public payable {
    require( beneficiaryAddress != msg.sender );
    donationsReceivedByAddress[beneficiaryAddress] += msg.value;
    LogDonation(beneficiaryAddress, msg.sender, msg.value);
  }

  function withdrawlAndClose() public {
    require( donationsReceived() >= minimumWithdrawl() );

    uint256 donated = donationsReceived();
    uint256 expectedFinal = minimumWithdrawl();

    donationsReceivedByAddress[msg.sender] = 0;
    minimumWithdrawlByAddress[msg.sender] = 0;
    hasOpenDonationCampaignByAddress[msg.sender] = false;

    msg.sender.transfer(donated);
    LogWithdrawl(msg.sender, donated, expectedFinal);
  }

  function donationCampaignStatus() public view returns(bool,uint256,uint256){
    return (
        hasOpenDonationCampaign(),
        donationsReceived(),
        minimumWithdrawl()
      );
  }

  /** Deprecated **/
  function hasOpenDonationCampaign() public view returns(bool){
    return hasOpenDonationCampaignByAddress[msg.sender];
  }

  function donationsReceived() public view returns(uint256){
    return donationsReceivedByAddress[msg.sender];
  }

  function minimumWithdrawl() public view returns(uint256){
    return minimumWithdrawlByAddress[msg.sender];
  }

  function () public {
     LogDonationCampaignFallback();
  }
}
