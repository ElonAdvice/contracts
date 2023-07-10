import {
  BribeFactory,
  Xeno,
  XenoFactory,
  XenoMinter,
  XenoRouter01,
  XenoVoter, Controller,
  GaugeFactory,
  Ve,
  VeXeno
} from "../../typechain";

export class CoreAddresses {

  readonly token: Xeno;
  readonly gaugesFactory: GaugeFactory;
  readonly bribesFactory: BribeFactory;
  readonly factory: XenoFactory;
  readonly router: XenoRouter01;
  readonly ve: Ve;
  readonly veXeno: VeXeno;
  readonly voter: XenoVoter;
  readonly minter: XenoMinter;
  readonly controller: Controller;


  constructor(token: Xeno, gaugesFactory: GaugeFactory, bribesFactory: BribeFactory, factory: XenoFactory, router: XenoRouter01, ve: Ve, veXeno: VeXeno, voter: XenoVoter, minter: XenoMinter, controller: Controller) {
    this.token = token;
    this.gaugesFactory = gaugesFactory;
    this.bribesFactory = bribesFactory;
    this.factory = factory;
    this.router = router;
    this.ve = ve;
    this.veXeno = veXeno;
    this.voter = voter;
    this.minter = minter;
    this.controller = controller;
  }
}
