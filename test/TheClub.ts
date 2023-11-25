import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('TheClub', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTheClubFixture() {
    //@ts-ignore
    const [owner, newMember] = await ethers.getSigners();

    const TheClub = await ethers.getContractFactory('TheClub');
    const theClub = await TheClub.deploy();

    const entryFee = ethers.parseEther('.2');

    const HOURS = {
      TWENTY_FOUR_HOURS: 24 * 60 * 60,
      TEN_HOURS: 10 * 60 * 60,
    };

    return { owner, newMember, theClub, entryFee, HOURS };
  }

  describe('Set Owner', function () {
    it('Should have owner set', async function () {
      const { owner, theClub } = await loadFixture(deployTheClubFixture);

      expect(await theClub.owner()).to.equal(owner.address);
    });

    it('Should set entry fee to .2 ether', async function () {
      const { theClub } = await loadFixture(deployTheClubFixture);

      expect(await theClub.entryFee()).to.equal(ethers.parseEther('.2'));
    });
  });

  describe('signup', function () {
    it('Should revert if owner tries to sign up', async function () {
      const { theClub } = await loadFixture(deployTheClubFixture);

      await expect(theClub.payDeposit()).to.be.revertedWith(
        "Dude you're already the owner of the club"
      );
    });

    it('It Should emit timer event after successful Sign up', async function () {
      const { theClub, newMember, HOURS } = await loadFixture(
        deployTheClubFixture
      );
      await expect(theClub.connect(newMember).signUp())
        .to.emit(theClub, 'Timer')
        .withArgs(newMember.address, HOURS.TWENTY_FOUR_HOURS);
    });

    it('Should revert if user tries to sign up again', async function () {
      const { theClub, newMember, HOURS } = await loadFixture(
        deployTheClubFixture
      );

      await theClub.connect(newMember).signUp();

      time.increase(HOURS.TEN_HOURS);

      await expect(theClub.connect(newMember).signUp()).to.be.revertedWith(
        'You already signed up make sure to pay within the 24 hour period'
      );
    });
  });

  describe('payDeposit', function () {
    // beforeEach(async () => {
    //   const { theClub, newMember } = await loadFixture(deployTheClubFixture);

    // });

    it('Should revert if owner tries to pay deposit', async function () {
      const { theClub, entryFee } = await loadFixture(deployTheClubFixture);

      await expect(theClub.payDeposit({ value: entryFee })).to.be.revertedWith(
        "Dude you're already the owner of the club"
      );
    });

    it('Should revert if timer has expired after sign up', async function () {
      const { theClub, newMember, entryFee, HOURS } = await loadFixture(
        deployTheClubFixture
      );

      await time.increase(HOURS.TWENTY_FOUR_HOURS);

      await expect(
        theClub.connect(newMember).payDeposit({ value: entryFee })
      ).to.be.revertedWith('Your time to sign up has expired');
    });

    it('Should revert if fee is not paid', async function () {
      const { theClub, newMember } = await loadFixture(deployTheClubFixture);

      await theClub.connect(newMember).signUp();

      await time.increase(1000);

      await expect(theClub.connect(newMember).payDeposit()).to.be.revertedWith(
        'You must pay .2 ether to join this club'
      );
    });

    it('Should not revert if fee is paid', async function () {
      const { theClub, newMember, entryFee } = await loadFixture(
        deployTheClubFixture
      );

      await expect(
        theClub.connect(newMember).payDeposit({ value: entryFee })
      ).to.not.be.revertedWithoutReason();
    });

    it('Should emit Paid event with the correct args', async function () {
      const { theClub, newMember, entryFee } = await loadFixture(
        deployTheClubFixture
      );

      await expect(theClub.connect(newMember).payDeposit({ value: entryFee }))
        .to.emit(theClub, 'Paid')
        .withArgs(newMember.address, true);
    });
  });
});
