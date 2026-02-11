import { CopyElement } from '../components/CopyElement'

export function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="blog__inner">
        <CopyElement id="blog-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="blog-heading" as="h2" className="section-heading reveal" />
        <div className="blog__grid">
          {[
            { tag: 'Wellness', title: 'Benefits of a Regular Practice', excerpt: 'Discover how consistency transforms both body and mind.' },
            { tag: 'Technique', title: 'Pilates for Beginners', excerpt: 'Everything you need to know before your first reformer class.' },
            { tag: 'Lifestyle', title: 'Mindful Movement Daily', excerpt: 'Simple ways to bring awareness into your everyday routine.' },
          ].map((post, i) => (
            <div className={`blog__card reveal reveal-delay-${i + 1}`} key={i}>
              <span className="blog__tag">{post.tag}</span>
              <h3 className="blog__title">{post.title}</h3>
              <p className="blog__excerpt">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
