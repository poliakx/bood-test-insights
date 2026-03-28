import PageWrapper from "@/components/ui/PageWrapper"
import ChatPanel from "@/components/chat/ChatPanel"

export default function ChatPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ask questions about your blood test results and get contextual answers.
          </p>
        </section>

        <ChatPanel />
      </div>
    </PageWrapper>
  )
}

