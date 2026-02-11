import { Pill } from './components/Pill'
import { Dock } from './components/Dock'
import { Panel } from './components/Panel'
import { Toast } from './components/Toast'
import { CopyPopover } from './panels/CopyPopover'
import { StylePopover } from './panels/StylePopover'
import { useConfiguratorStore } from './store/configuratorStore'
import './styles/configurator.css'

export function Configurator() {
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const activeCopyElement = useConfiguratorStore(s => s.activeCopyElement)
  const styleMode = useConfiguratorStore(s => s.styleMode)
  const activeStyleElement = useConfiguratorStore(s => s.activeStyleElement)

  return (
    <>
      <Pill />
      <Dock />
      <Panel />
      <Toast />
      {copyMode && activeCopyElement && <CopyPopover />}
      {styleMode && activeStyleElement && <StylePopover />}
    </>
  )
}
