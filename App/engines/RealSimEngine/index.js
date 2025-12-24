// ==========================================================
// INSQUIZ — RealSimEngine (Motor central)
// 1 motor, 4 piezas internas
// ==========================================================

import assembleRealSim from "./RealSimAssembler";
import * as StateStore from "./RealSimStateStore";
import * as History from "./RealSimHistory";
import scoreRealSim from "./RealSimScoring";

const RealSimEngine = {
  assembleRealSim,
  StateStore,
  History,
  scoreRealSim,
};

export default RealSimEngine;
