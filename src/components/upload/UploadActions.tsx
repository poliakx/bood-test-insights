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
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            void onExtract()
          }}
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Extracting..." : "Extract results"}
        </button>
        {sourceType ? (
          <span className="text-sm text-gray-600">
            Detected type: {sourceType.toUpperCase()}
          </span>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </>
  )
}
