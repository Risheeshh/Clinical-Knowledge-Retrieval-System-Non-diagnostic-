import { useState } from 'react'
import Upload from './components/Upload'
import Chat from './components/Chat'

function App() {
  const [sessionId, setSessionId] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="container mx-auto px-4 py-8">
        {!sessionId ? (
          <Upload onUploadSuccess={(id) => setSessionId(id)} />
        ) : (
          <Chat sessionId={sessionId} />
        )}
      </main>
    </div>
  )
}

export default App
