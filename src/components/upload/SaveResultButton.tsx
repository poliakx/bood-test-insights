type SaveResultButtonProps = {
  onClick: () => void
  disabled?: boolean
  text?: string
}

export default function SaveResultButton({
  onClick,
  disabled = false,
  text = "Save result",
}: SaveResultButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {text}
    </button>
  )
}
