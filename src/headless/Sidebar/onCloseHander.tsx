import { closeSidebar } from '../../redux/sidebarSlice'
import { dispatch } from '../../redux/store'

export function onCloseHander() {
  dispatch(closeSidebar())
}
