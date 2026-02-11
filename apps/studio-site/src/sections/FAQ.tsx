import { useState } from 'react'
import { CopyElement } from '../components/CopyElement'
import { useConfiguratorStore } from '@care/configurator'

export function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null)
  const count = useConfiguratorStore(s => s.sectionItems.faq ?? 4)
  const items = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        <p className="section-eyebrow reveal">Common Questions</p>
        <CopyElement id="faq-heading" as="h2" className="section-heading reveal" />
        <div className="faq__items">
          {items.map(i => (
            <div className={`faq__item reveal ${openItem === i ? 'faq__item--open' : ''}`} key={i}>
              <div className="faq__q" onClick={() => setOpenItem(openItem === i ? null : i)}>
                <CopyElement id={`faq-${i}-q`} as="span" />
                <span className="faq__icon" />
              </div>
              <div className="faq__a">
                <CopyElement id={`faq-${i}-a`} as="p" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
