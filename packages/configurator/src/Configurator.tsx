import { Pill } from './components/Pill'
import { Dock } from './components/Dock'
import { Panel } from './components/Panel'
import { Toast } from './components/Toast'
import { CopyPopover } from './panels/CopyPopover'
import { SectionPopover } from './panels/SectionPopover'
import { useConfiguratorStore } from './store/configuratorStore'
import './styles/configurator.css'

export function Configurator() {
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const activeCopyElement = useConfiguratorStore(s => s.activeCopyElement)
  const activeSectionBlob = useConfiguratorStore(s => s.activeSectionBlob)

  return (
    <>
      <Pill />
      <Dock />
      <Panel />
      <Toast />
      {copyMode && activeCopyElement && <CopyPopover />}
      {activeSectionBlob && <SectionPopover />}
    </>
  )
}
