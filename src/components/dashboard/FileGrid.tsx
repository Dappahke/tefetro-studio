import FileCard from './FileCard'

export default function FileGrid({ projectId }: { projectId: string }) {
  const files = [
    { name: 'Floor Plan v1', locked: false },
    { name: 'Elevation v1', locked: true },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {files.map((file, i) => (
        <FileCard key={i} {...file} />
      ))}
    </div>
  )
}