import { useConfiguratorStore } from '../store/configuratorStore'

export function CopyPanel() {
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const setCopyMode = useConfiguratorStore(s => s.setCopyMode)

  return (
    <div className="cfg-copy-instructions">
      <p style={{ marginTop: 0 }}>
        <strong>Edit any text on the page.</strong>
      </p>
      <p>
        {copyMode
          ? 'Copy editing is active. Click any highlighted text element on the page to choose from premade alternatives or write your own.'
          : 'Enable copy editing mode to start modifying text content across the site.'}
      </p>
      <button
        className={`cfg-share-btn ${copyMode ? 'cfg-effect-option--active' : ''}`}
        onClick={() => setCopyMode(!copyMode)}
        style={{ marginTop: 4 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
          {copyMode ? (
            <>
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </>
          ) : (
            <>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
          )}
        </svg>
        {copyMode ? 'Disable Copy Mode' : 'Enable Copy Mode'}
      </button>
      {copyMode && (
        <p style={{ fontSize: 11, color: 'var(--cfg-text-muted)', marginBottom: 0 }}>
          Text elements with dashed outlines are editable. Click one to see options.
        </p>
      )}
    </div>
  )
}
