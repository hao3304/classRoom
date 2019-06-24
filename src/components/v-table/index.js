import DataList from "./components/datalist/DataList";
import VirtualScroll from "./components/base/VirtualScroll";
import GridBase from "./components/gridbase/GridBase";
import GridColumn from "./components/gridbase/GridColumn";
import GridColumnGroup from "./components/gridbase/GridColumnGroup";
import GridHeaderRow from "./components/gridbase/GridHeaderRow";
import Locale from "./components/locale";
import DataGrid from "./components/datagrid/DataGrid";
import Draggable from "./components/draggable/Draggable";
import Droppable from "./components/droppable/Droppable";
import Resizable from "./components/resizable/Resizable";
import TreeGrid from "./components/treegrid/TreeGrid";
const components = [
  VirtualScroll,
  DataList,
  GridBase,
  GridColumn,
  GridColumnGroup,
  GridHeaderRow,
  DataGrid,
  TreeGrid
];

const directives = [Draggable, Droppable, Resizable];
window.Locale = Locale;
const install = function(Vue, opts = {}) {
  Locale.use(opts.locale);
  window.Vue = Vue;
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  directives.forEach(directive => {
    Vue.directive(directive.name, directive);
  });
  window.EventHub = new Vue();
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const EasyUI = {
  install
};
export default EasyUI;
