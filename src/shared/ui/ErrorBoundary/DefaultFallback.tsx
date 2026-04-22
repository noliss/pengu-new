export const DefaultFallback = ({ error, onReset }: { error: Error; onReset: () => void }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      gap: '1rem',
      color: 'white',
    }}
  >
    <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Что-то пошло не так</h2>
    <p style={{ opacity: 0.7 }}>Попробуй перезагрузить страницу или вернуться позже.</p>
    {import.meta.env.DEV && (
      <pre
        style={{
          background: 'rgba(255,255,255,0.08)',
          padding: '1rem',
          borderRadius: 8,
          fontSize: '0.8rem',
          maxWidth: '100%',
          overflow: 'auto',
          textAlign: 'left',
        }}
      >
        {error.message}
        {error.stack ? `\n\n${error.stack}` : ''}
      </pre>
    )}
    <button
      onClick={onReset}
      style={{
        padding: '8px 16px',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.1)',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      Попробовать снова
    </button>
  </div>
);
