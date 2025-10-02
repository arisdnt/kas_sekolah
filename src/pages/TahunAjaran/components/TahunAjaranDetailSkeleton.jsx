import { Separator } from '@radix-ui/themes'

export function TahunAjaranDetailSkeleton() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-slate-300 bg-white shadow-sm">
      <div className="flex-1 space-y-6 px-6 py-5 animate-pulse">
        <div className="space-y-3">
          <div className="h-3 w-52 bg-slate-200" />
          <div className="h-8 w-64 bg-slate-200" />
          <div className="h-4 w-48 bg-slate-200" />
          <div className="grid gap-y-2 text-slate-200 sm:grid-cols-2 sm:gap-x-10">
            <div className="h-4 w-40 bg-slate-200" />
            <div className="h-4 w-32 bg-slate-200" />
          </div>
        </div>

        <Separator className="bg-slate-200" size="4" />

        <div className="grid gap-6 md:grid-cols-2 md:gap-x-10">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`skeleton-field-${idx}`} className="space-y-2">
              <div className="h-3 w-28 bg-slate-200" />
              <div className="h-4 w-40 bg-slate-200" />
            </div>
          ))}
        </div>

        <Separator className="bg-slate-200" size="4" />

        <div className="space-y-3">
          <div className="h-3 w-32 bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={`skeleton-meta-${idx}`} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-slate-200" />
                <div className="h-4 w-44 bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="h-3 w-64 bg-slate-200" />
        <div className="mt-2 h-3 w-40 bg-slate-200" />
      </div>
    </div>
  )
}
