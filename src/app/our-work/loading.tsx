// ============================================================
// OUR WORK PAGE - LOADING STATE
// Shown while page data is being fetched
// ============================================================

export default function OurWorkLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="min-h-[90vh] bg-[#0f2a44] animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content Skeleton */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-white/10" />
                <div className="h-4 w-20 bg-white/10 rounded" />
              </div>

              <div className="h-20 w-3/4 bg-white/10 rounded-lg" />

              <div className="space-y-3">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
                <div className="h-4 w-4/6 bg-white/10 rounded" />
              </div>

              <div className="flex gap-4 pt-4">
                <div className="h-14 w-44 bg-white/10 rounded-lg" />
                <div className="h-14 w-44 bg-white/10 rounded-lg" />
              </div>

              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-8">
                <div>
                  <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
                <div>
                  <div className="h-8 w-8 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
                <div>
                  <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
              </div>
            </div>

            {/* Right Image Skeleton */}
            <div className="aspect-[4/3] bg-white/5 rounded-2xl border border-white/10" />
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="h-10 w-24 bg-gray-100 rounded-full flex-shrink-0 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 rounded" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-4 w-full bg-gray-100 rounded" />
                  <div className="h-4 w-full bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



//✅ FILE 14: src/app/our-work/loading.tsx
//🎯 Features: Full-page skeleton matching layout structure
//🎨 Animated pulse effect for perceived performance