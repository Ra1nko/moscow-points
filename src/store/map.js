import { defineStore } from "pinia";

export const useMapStore = defineStore({
  id: "map",
  state: () => ({
    districts: [],
  }),
});
