import ProjectStages from './ProjectStages'
import FileGrid from './FileGrid'
import PaymentSummary from './PaymentSummary'
import ChatPanel from './ChatPanel'
import RevisionPanel from './RevisionPanel'

export default function ProjectView({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-bold">Project Overview</h1>
        <p className="text-sm text-gray-500">Project ID: {projectId}</p>
      </div>

      {/* Stages */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Progress</h2>
        <ProjectStages currentStage={1} />
      </div>

      {/* Files */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Project Files</h2>
        <FileGrid projectId={projectId} />
      </div>

      {/* Payments */}
      <PaymentSummary total={120000} paid={80000} />

      {/* Revisions */}
      <RevisionPanel projectId={projectId} />

      {/* Chat */}
      <div className="bg-white p-6 rounded-2xl shadow h-[400px]">
        <h2 className="font-semibold mb-4">Project Chat</h2>
        <ChatPanel projectId={projectId} />
      </div>

    </div>
  )
}