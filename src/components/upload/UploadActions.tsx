import ErrorState from '@/components/ui/ErrorState'

type UploadActionsProps = {
  isLoading: boolean
  sourceType: string
  errorMessage: string
  onExtract: () => Promise<void> | void
}

export default function UploadActions({
  isLoading,
  sourceType,
  errorMessage,
  onExtract,
}: UploadActionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { void onExtract() }}
          disabled={isLoading}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "Extracting…" : "Extract results"}
        </button>
        {sourceType ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
            {sourceType.toUpperCase()}
          </span>
        ) : null}
      </div>
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </div>
  )
}

