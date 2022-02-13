import useGeneratePointsInPoly from "@/services/useGeneratePointsInPoly";
import * as Comlink from "comlink";

const service = {
  generatePointsInPoly: useGeneratePointsInPoly,
};

Comlink.expose(service, self);
