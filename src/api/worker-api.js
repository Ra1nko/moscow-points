import MyWorker from "@/worker?worker";
import * as Comlink from "comlink";

const worker = new MyWorker();
const service = Comlink.wrap(worker);

export const generatePointsInPoly = service.generatePointsInPoly;
