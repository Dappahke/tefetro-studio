type Props = {
  currentStage: number
}

const stages = [
  'Concept',
  'Floor Plans',
  'Elevations',
  'BOQ',
  'Construction',
]

export default function ProjectStages({ currentStage }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, index) => (
          <div key={stage} className="flex-1 text-center">
            
            <div
              className={`h-2 rounded-full mb-2 ${
                index <= currentStage ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />

            <p className="text-xs">{stage}</p>
          </div>
        ))}
      </div>
    </div>
  )
}