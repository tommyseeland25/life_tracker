import { useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { downloadJson, parseImport, readFileText } from '../../lib/storage/exportImport'
import { useStore } from '../../store/storeContext'

/** Backup / restore. Will move to a Settings spot once real pages exist. */
export function DataCard() {
  const { data, replace } = useStore()
  const input = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const onFile = async (file?: File) => {
    if (!file) return
    try {
      replace(parseImport(await readFileText(file)))
      setMsg('Imported.')
    } catch (e) {
      setMsg((e as Error).message)
    }
    if (input.current) input.current.value = ''
  }

  return (
    <Card className="sm:col-span-2">
      <h2 className="text-2xl font-semibold">Your data</h2>
      <p className="mt-2 text-[var(--text-muted)]">
        {data.areas.length} areas, {data.habits.length} habits, stored in this browser. Export a backup any time.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={() => downloadJson(data)}>Export JSON</Button>
        <Button variant="secondary" onClick={() => input.current?.click()}>Import JSON</Button>
        <input ref={input} type="file" accept="application/json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        {msg && <span role="status" className="text-sm text-[var(--text-muted)]">{msg}</span>}
      </div>
    </Card>
  )
}
