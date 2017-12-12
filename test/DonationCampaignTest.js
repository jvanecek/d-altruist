var DonationCampaign = artifacts.require("../contracts/DonationCampaign.sol");

async function expectThrow(promise,descriptionOnNoThrow){
  try {
    await promise;
  } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail(descriptionOnNoThrow);
};

contract('DonationCampaign', function(accounts) {

  let campaingOpener = accounts[0];
  let donator = accounts[1];
  let anotherDonator = accounts[2];

  let donatorInitialBalance = 0;
  let campaingOpenerInitialBalance = 0;

  // Calculada como la resta entre el balance antes y despues de ejecutarla
  // let openNewGasCost = 4223999940755456;

  beforeEach(async function() {
    donatorContract = await DonationCampaign.new();
    campaingOpenerInitialBalance = await web3.eth.getBalance(campaingOpener);
    donatorInitialBalance = await web3.eth.getBalance(donator);
  });

  it("Create donation", async function() {

    let hasOpenedDonationCampaign = await donatorContract.hasOpenDonationCampaign({from: campaingOpener});
    assert.isFalse( hasOpenedDonationCampaign );

    await donatorContract.openNew(90000, {from: campaingOpener});

    hasOpenedDonationCampaign = await donatorContract.hasOpenDonationCampaign({from: campaingOpener});
    assert.isTrue( hasOpenedDonationCampaign );

    hasOpenedDonationCampaign = await donatorContract.hasOpenDonationCampaign({from: donator});
    assert.isFalse( hasOpenedDonationCampaign );
  });

  it("Donation affects involved balances", async function() {

    await donatorContract.openNew(90000, {from: campaingOpener});

    let balanceOfCampaign = await donatorContract.donationsReceived({from: campaingOpener});
    assert.equal( balanceOfCampaign, 0 );

    let balanceToDonate = 50000;
    await donatorContract.donate(campaingOpener, {from: donator, value: balanceToDonate});

    balanceOfCampaign = await donatorContract.donationsReceived({from: campaingOpener});
    assert.equal( balanceOfCampaign.toNumber(), balanceToDonate );

    let balanceOfOthersCampaign = await donatorContract.donationsReceived({from: donator});
    assert.equal( balanceOfOthersCampaign.toNumber(), 0 );

  });

  it("Cant withdrawl if minimum donation not completed", async function(){

    let balanceToWithrawl = 90000;
    await donatorContract.openNew(balanceToWithrawl, {from: campaingOpener});
    expectThrow( donatorContract.withdrawlAndClose({ from: campaingOpener }), "No se dono nada todavia");

    await donatorContract.donate(campaingOpener, {from: donator, value: 70000});
    expectThrow( donatorContract.withdrawlAndClose({ from: campaingOpener }), "Se dono solamente 70000");

    await donatorContract.donate(campaingOpener, {from: anotherDonator, value: 20000});

    let hasOpenedDonationCampaign = await donatorContract.hasOpenDonationCampaign({from: campaingOpener});
    assert.isTrue( hasOpenedDonationCampaign );

    await donatorContract.withdrawlAndClose({ from: campaingOpener });

    hasOpenedDonationCampaign = await donatorContract.hasOpenDonationCampaign({from: campaingOpener});
    assert.isFalse( hasOpenedDonationCampaign );
    /*
    let campaignOpenerCurrentBalance = await web3.eth.getBalance(campaingOpener);
    assert.equal(
      campaingOpenerInitialBalance.toNumber() - openNewGasCost + balanceToWithrawl,
      campaignOpenerCurrentBalance.toNumber() )
    */
  });
});
