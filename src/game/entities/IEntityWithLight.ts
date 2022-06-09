import Lamp from "./Lamp";

export interface IEntityWithLight {
  setLampList: (lampList: Lamp[]) => void,
  getLampList: () => Lamp[]
}