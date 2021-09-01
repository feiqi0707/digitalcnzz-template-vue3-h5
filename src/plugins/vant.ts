import { App as VM } from 'vue'
import {
  Search,
  Icon,
  Picker,
  Button,
  Cell,
  CellGroup,
  Form,
  Field,
  Popup,
  Area,
  Checkbox,
  CheckboxGroup,
  Empty,
  Overlay,
  Tag,
  Image,
  Notify,
  Skeleton,
  List,
  DropdownMenu,
  DropdownItem,
  Divider,
  Col,
  Row,
  Loading,
  NavBar,
  Sticky
} from 'vant'

const plugins = [
  Search,
  Icon,
  Picker,
  Button,
  Cell,
  CellGroup,
  Form,
  Field,
  Popup,
  Area,
  Checkbox,
  CheckboxGroup,
  Empty,
  Overlay,
  Tag,
  Image,
  Notify,
  Skeleton,
  List,
  DropdownMenu,
  DropdownItem,
  Divider,
  Col,
  Row,
  Loading,
  NavBar,
  Sticky
]

export const vantPlugins = {
  install: function(vm: VM) {
    plugins.forEach(item => {
      vm.component(item.name, item)
    })
  }
}
