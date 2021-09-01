import Vconsole from "vconsole";
import { App as VM } from "vue";
const vconsole = new Vconsole();

export const vConsolePlugins = {
  install: function (vm: VM) {
    return vconsole
  }
}
