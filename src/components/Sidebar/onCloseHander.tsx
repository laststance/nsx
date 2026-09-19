import { closeSidebar } from '../../redux/sidebarSlice'
import { dispatch } from '../../redux/store'

export function onCloseHander(): void {
  dispatch(closeSidebar())
}
