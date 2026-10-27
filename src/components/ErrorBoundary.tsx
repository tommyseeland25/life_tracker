import { Component, type ReactNode } from 'react'

/** Keeps one broken page from blanking the whole app (and shows "TODO: implement ..." clearly). */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-2xl font-semibold">This page hit an error</h2>
          <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
