type Props = {
  name: string
  locked?: boolean
  url?: string
}

export default function FileCard({ name, locked, url }: Props) {
  return (
    <div className="border p-4 rounded-xl bg-white">
      <p className="font-medium">{name}</p>

      {locked ? (
        <p className="text-red-500 text-sm mt-2">
          🔒 Locked – Complete payment to access
        </p>
      ) : (
        <a
          href={url || '#'}
          target="_blank"
          className="text-blue-500 text-sm mt-2 inline-block"
        >
          Download
        </a>
      )}
    </div>
  )
}