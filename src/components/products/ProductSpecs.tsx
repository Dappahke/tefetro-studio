interface ProductSpecsProps {
  bedrooms?: number
  bathrooms?: number
  floors?: number
  plinthArea?: number
  length?: number
  width?: number
}

export function ProductSpecs({ 
  bedrooms, 
  bathrooms, 
  floors, 
  plinthArea,
  length,
  width 
}: ProductSpecsProps) {
  const specs = [
    { 
      icon: '🛏️', 
      value: bedrooms || '-', 
      label: 'Bedrooms',
      description: 'Sleeping quarters'
    },
    { 
      icon: '🚿', 
      value: bathrooms || '-', 
      label: 'Bathrooms',
      description: 'Full baths included'
    },
    { 
      icon: '🏢', 
      value: floors || '1', 
      label: 'Floors',
      description: 'Building levels'
    },
    { 
      icon: '📐', 
      value: plinthArea ? `${plinthArea}m²` : '-', 
      label: 'Plinth Area',
      description: 'Ground floor footprint'
    },
    { 
      icon: '↔️', 
      value: length && width ? `${length}m × ${width}m` : '-', 
      label: 'Dimensions',
      description: 'Length × Width'
    },
    { 
      icon: '📏', 
      value: plinthArea ? `${Math.round(plinthArea * 10.764)} sq ft` : '-', 
      label: 'Square Feet',
      description: 'Imperial conversion'
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-mist/30">
      <h3 className="font-semibold text-deep-700 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-tefetra" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Technical Specifications
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {specs.map((spec) => (
          <div 
            key={spec.label} 
            className="p-4 bg-canvas rounded-xl hover:bg-sage/5 transition-colors"
          >
            <div className="text-2xl mb-2">{spec.icon}</div>
            <div className="text-lg font-bold text-deep-700">{spec.value}</div>
            <div className="text-sm font-medium text-neutral-600">{spec.label}</div>
            <div className="text-xs text-neutral-400 mt-1">{spec.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}