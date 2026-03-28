import ErrorState from '@/src/components/ui/ErrorState'

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
    <>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => {
            void onExtract()
          }}
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Extracting results..." : "Extract results"}
        </button>
        {sourceType ? (
          <span className="text-sm text-gray-600">
            Detected type: {sourceType.toUpperCase()}
          </span>
        ) : null}
      </div>

      {errorMessage ? <ErrorState message={errorMessage} className="mt-3" /> : null}
    </>
  )
}
