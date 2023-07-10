import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import chai from "chai";
import {Deploy} from "../../../scripts/deploy/Deploy";
import {TimeUtils} from "../../TimeUtils";
import {BigNumber} from "ethers";
import {ContractTestHelper, Controller, Multicall2, Token, Ve, VeXeno} from "../../../typechain";
import {formatUnits, parseUnits} from "ethers/lib/utils";
import {Misc} from "../../../scripts/Misc";

const {expect} = chai;

const WEEK = 60 * 60 * 24 * 7;

describe("ve Xeno tests", function () {

  let snapshotBefore: string;
  let snapshot: string;

  let owner: SignerWithAddress;
  let owner2: SignerWithAddress;
  let ve: Ve;
  let veXeno: VeXeno;
  let helper: ContractTestHelper;
  let wmatic: Token;


  before(async function () {
    snapshotBefore = await TimeUtils.snapshot();
    [owner, owner2] = await ethers.getSigners();
    wmatic = await Deploy.deployContract(owner, 'Token', 'WMATIC', 'WMATIC', 18, owner.address) as Token;
    await wmatic.mint(owner.address, parseUnits('10000'));
    await wmatic.mint(owner2.address, parseUnits('10000'));

    const controller = await Deploy.deployContract(owner, 'Controller') as Controller;
    ve = await Deploy.deployVe(owner, wmatic.address, controller.address);
    veXeno = await Deploy.deployVeXeno(owner, ve.address);

    await wmatic.approve(ve.address, parseUnits('10000'))
    await wmatic.connect(owner2).approve(ve.address, parseUnits('10000'))
    await ve.createLock(parseUnits('1'), 60 * 60 * 24 * 365 * 4);

    helper = await Deploy.deployContract(owner, 'ContractTestHelper') as ContractTestHelper;
  });

  after(async function () {
    await TimeUtils.rollback(snapshotBefore);
  });


  beforeEach(async function () {
    snapshot = await TimeUtils.snapshot();
  });

  afterEach(async function () {
    await TimeUtils.rollback(snapshot);
  });

  it("veForAt test", async function () {
    expect(await veXeno.veForAt(1, 0)).is.eq(BigNumber.from('0'));
    const multi = await Deploy.deployContract(owner, 'Multicall2') as Multicall2;
    expect(await veXeno.veForAt(1, await multi.getCurrentBlockTimestamp())).above(BigNumber.from('0'));
    await TimeUtils.advanceBlocksOnTs(WEEK + 123);
    expect(await veXeno.veForAt(1, await multi.getCurrentBlockTimestamp())).above(BigNumber.from('0'));
  });

  it("multi checkpointToken with empty balance test", async function () {
    await veXeno.setDepositor(helper.address);
    await helper.multipleVeXenoCheckpoints(veXeno.address);

    const curTs = (await veXeno.lastTokenTime()).toNumber();
    const nextWeek = curTs + WEEK;
    await TimeUtils.setNextBlockTime(nextWeek);

    await helper.multipleVeXenoCheckpoints(veXeno.address);
  });

  it("multi checkpointToken with positive balance test", async function () {
    await veXeno.setDepositor(helper.address);
    await wmatic.transfer(veXeno.address, parseUnits('1'));
    await helper.multipleVeXenoCheckpoints(veXeno.address);
  });

  it("adjustToDistribute test", async function () {
    expect(await veXeno.adjustToDistribute(100, 1, 1, 20)).eq(100);
    expect(await veXeno.adjustToDistribute(100, 0, 1, 20)).eq(100);
    expect(await veXeno.adjustToDistribute(100, 2, 1, 20)).eq(5);
  });

  it("checkpointToken not depositor revert test", async function () {
    await expect(veXeno.connect(owner2).checkpointToken()).revertedWith('!depositor');
  });

  it("setDepositor not depositor revert test", async function () {
    await expect(veXeno.connect(owner2).setDepositor(Misc.ZERO_ADDRESS)).revertedWith('!depositor');
  });

  it("checkpointTotalSupply dummy test", async function () {
    await ve.checkpoint();
    await veXeno.checkpointTotalSupply();
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    await ve.checkpoint();
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    await ve.checkpoint();
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    await ve.checkpoint();
    await veXeno.checkpointTotalSupply();
  });

  it("adjustVeSupply test", async function () {
    expect(await veXeno.adjustVeSupply(100, 100, 5, 10)).eq(5);
    expect(await veXeno.adjustVeSupply(99, 100, 5, 10)).eq(0);
    expect(await veXeno.adjustVeSupply(200, 100, 5, 10)).eq(0);
    expect(await veXeno.adjustVeSupply(2, 1, 20, 5)).eq(15);
    expect(await veXeno.adjustVeSupply(3, 1, 20, 5)).eq(10);
  });

  it("claim for non exist token test", async function () {
    await veXeno.claim(99);
  });

  it("claim without rewards test", async function () {
    await veXeno.claim(1);
  });

  it("claim for early token test", async function () {
    const controller = await Deploy.deployContract(owner, 'Controller') as Controller;
    const ve1 = await Deploy.deployVe(owner, wmatic.address, controller.address);
    await wmatic.approve(ve1.address, parseUnits('10000'))
    await ve1.createLock(parseUnits('1'), 60 * 60 * 24 * 14);
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    const veXeno1 = await Deploy.deployVeXeno(owner, ve.address);

    await veXeno.checkpointToken();

    await veXeno1.claim(1);
  });

  it("claim for early token with delay test", async function () {
    const controller = await Deploy.deployContract(owner, 'Controller') as Controller;
    const ve1 = await Deploy.deployVe(owner, wmatic.address, controller.address);
    await wmatic.approve(ve1.address, parseUnits('10000'))
    await ve1.createLock(parseUnits('1'), 60 * 60 * 24 * 14);
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    const veXeno1 = await Deploy.deployVeXeno(owner, ve.address);

    await veXeno.checkpointToken();
    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    await veXeno1.claim(1);
  });

  it("claim with rewards test", async function () {
    await ve.createLock(WEEK * 2, 60 * 60 * 24 * 365 * 4);

    await TimeUtils.advanceBlocksOnTs(WEEK * 2);

    await wmatic.transfer(veXeno.address, parseUnits('1'));
    await veXeno.checkpointToken();
    await veXeno.checkpointTotalSupply();
    await veXeno.claim(2);
  });

  it("claim complex test", async function () {
    await ve.createLock(parseUnits('1'), 60 * 60 * 24 * 365 * 4);
    await ve.connect(owner2).createLock(parseUnits('1'), 60 * 60 * 24 * 365 * 4);

    await TimeUtils.advanceBlocksOnTs(WEEK * 2);

    await veXeno.checkpointToken();

    await TimeUtils.advanceBlocksOnTs(WEEK * 2);

    await wmatic.transfer(veXeno.address, parseUnits('1'));
    await veXeno.checkpointToken();
    await TimeUtils.advanceBlocksOnTs(WEEK);

    const bal0 = (await ve.locked(1)).amount;
    const bal1 = (await ve.locked(2)).amount;
    const bal2 = (await ve.locked(3)).amount;

    console.log('ve balance before', formatUnits(await wmatic.balanceOf(ve.address)))
    console.log('veXeno balance before', formatUnits(await wmatic.balanceOf(veXeno.address)))

    await veXeno.claim(1);
    await veXeno.claim(2);
    await veXeno.connect(owner2).claim(3);

    console.log('ve balance', formatUnits(await wmatic.balanceOf(ve.address)))
    console.log('veXeno balance', formatUnits(await wmatic.balanceOf(veXeno.address)))

    // expect(+formatUnits(await wmatic.balanceOf(veXeno.address))).eq(0)


    for (let i = 0; i < 9; i++) {
      await wmatic.transfer(veXeno.address, parseUnits('1'));
      await veXeno.checkpointToken();
      await TimeUtils.advanceBlocksOnTs(WEEK);

      // await veXeno.claim(1);
      await veXeno.claim(2);
      await veXeno.connect(owner2).claim(3);


      console.log('ve balance', i, formatUnits(await wmatic.balanceOf(ve.address)))
      console.log('veXeno balance', i, formatUnits(await wmatic.balanceOf(veXeno.address)))
    }

    await veXeno.checkpointToken();
    await TimeUtils.advanceBlocksOnTs(WEEK);

    await veXeno.claim(1);
    await veXeno.claim(2);
    await veXeno.connect(owner2).claim(3);


    console.log('ve balance final', formatUnits(await wmatic.balanceOf(ve.address)))
    console.log('veXeno balance final', formatUnits(await wmatic.balanceOf(veXeno.address)))

    expect(Number(formatUnits((await ve.locked(1)).amount.sub(bal0))).toFixed(0)).not.eq('0')
    expect(Number(formatUnits((await ve.locked(2)).amount.sub(bal1))).toFixed(0)).not.eq('0')
    expect(Number(formatUnits((await ve.locked(3)).amount.sub(bal2))).toFixed(0)).not.eq('0')
  });

  it("claim without checkpoints after the launch should return zero", async function () {
    await ve.createLock(parseUnits('1'), 60 * 60 * 24 * 365 * 4);
    const maxUserEpoch = await ve.userPointEpoch(2)
    const startTime = await veXeno.startTime();
    let weekCursor = await veXeno.timeCursorOf(2);
    let userEpoch;
    if (weekCursor.isZero()) {
      userEpoch = await veXeno.findTimestampUserEpoch(ve.address, 2, startTime, maxUserEpoch);
    } else {
      userEpoch = await veXeno.userEpochOf(2);
    }
    if (userEpoch.isZero()) {
      userEpoch = BigNumber.from(1);
    }
    const userPoint = await ve.userPointHistory(2, userEpoch);
    if (weekCursor.isZero()) {
      weekCursor = userPoint.ts.add(WEEK).sub(1).div(WEEK).mul(WEEK);
    }
    const lastTokenTime = await veXeno.lastTokenTime();
    expect(weekCursor.gte(lastTokenTime)).eq(true);
  });

  it("claim with rewards with minimal possible amount and lock", async function () {
    await ve.createLock(4 * 365 * 86400, WEEK);

    await TimeUtils.advanceBlocksOnTs(WEEK * 2);
    await wmatic.transfer(veXeno.address, parseUnits('1'));
    await veXeno.checkpointToken();
    await veXeno.checkpointTotalSupply();

    // const maxUserEpoch = await ve.userPointEpoch(2)
    // console.log('maxUserEpoch', maxUserEpoch.toString());
    //
    // const startTime = await veXeno.startTime();
    // console.log('startTime', startTime.toString());
    //
    // let weekCursor = await veXeno.timeCursorOf(2);
    // console.log('weekCursor', weekCursor.toString());
    //
    // let userEpoch;
    // if (weekCursor.isZero()) {
    //   userEpoch = await veXeno.findTimestampUserEpoch(ve.address, 2, startTime, maxUserEpoch);
    //   console.log('userEpoch from findTimestampUserEpoch', userEpoch.toString());
    // } else {
    //   userEpoch = await veXeno.userEpochOf(2);
    //   console.log('userEpoch', userEpoch.toString());
    // }
    //
    // if (userEpoch.isZero()) {
    //   userEpoch = BigNumber.from(1);
    // }
    //
    // const userPoint = await ve.userPointHistory(2, userEpoch);
    // console.log('///userPoint blk', userPoint.blk.toString());
    // console.log('///userPoint ts', userPoint.ts.toString());
    // console.log('///userPoint bias', userPoint.bias.toString());
    // console.log('///userPoint slope', userPoint.slope.toString());
    //
    // if (weekCursor.isZero()) {
    //   weekCursor = userPoint.ts.add(WEEK).sub(1).div(WEEK).mul(WEEK);
    //   console.log("weekCursor from userPoint", weekCursor.toString());
    // }
    //
    // const lastTokenTime = await veXeno.lastTokenTime();
    // console.log('lastTokenTime', lastTokenTime.toString());
    // if (weekCursor.gte(lastTokenTime)) {
    //   console.log("weekCursor >= lastTokenTime STOP", weekCursor.sub(lastTokenTime).toString());
    //   return;
    // }
    // if (weekCursor.lt(startTime)) {
    //   weekCursor = startTime;
    //   console.log("weekCursor set to start time", weekCursor.toString());
    // }

    await TimeUtils.advanceBlocksOnTs(WEEK * 2);

    let bal = await ve.balanceOfNFT(2)
    await veXeno.claim(2);
    expect((await ve.balanceOfNFT(2)).sub(bal)).eq(0);

    // SECOND CLAIM

    await wmatic.transfer(veXeno.address, parseUnits('1'));
    await veXeno.checkpointToken();
    await veXeno.checkpointTotalSupply();

    await TimeUtils.advanceBlocksOnTs(123456);

    bal = await ve.balanceOfNFT(2)
    await veXeno.claim(2);
    expect((await ve.balanceOfNFT(2)).sub(bal)).eq(0);
  });

  it("claimMany on old block test", async function () {
    await ve.createLock(4 * 365 * 86400, WEEK);
    await veXeno.claimMany([1, 2, 0]);
  });

});
