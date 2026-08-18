import { CheckCircle2, Clock, Lock } from 'lucide-react';
import type { Watch } from '@/types/watch';

interface WatchCardProps {
  watch: Watch;
  onClick: () => void;
  index: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; classes: string; icon: typeof CheckCircle2 }
> = {
  Available: {
    label: 'Available',
    classes: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
    icon: CheckCircle2,
  },
  Reserved: {
    label: 'Reserved',
    classes: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
    icon: Clock,
  },
  Sold: {
    label: 'Sold',
    classes: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
    icon: Lock,
  },
};

export default function WatchCard({ watch, onClick, index }: WatchCardProps) {
  const status = STATUS_CONFIG[watch.status] ?? STATUS_CONFIG.Available;
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${index * 60}ms` }}
      className="group text-left animate-slide-up opacity-0 [animation-fill-mode:forwards] focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-400/50 rounded-2xl"
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink-850 shadow-card transition-all duration-500 group-hover:shadow-luxe group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
          <img
            src={watch.primary_image ?? ''}
            alt={`${watch.brand} ${watch.model}`}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              watch.status === 'Sold' ? 'grayscale-[0.5] opacity-70' : ''
            }`}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md ${status.classes}`}
            >
              <StatusIcon className="w-3 h-3" strokeWidth={2} />
              {status.label}
            </span>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-bronze-200 bg-ink-950/70 backdrop-blur-md ring-1 ring-bronze-400/20">
            ${watch.price.toLocaleString()}
          </div>

          {/* Bottom info on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-serif text-lg text-zinc-50 leading-tight">{watch.brand}</h3>
            <p className="text-sm text-zinc-300 mt-0.5">{watch.model}</p>
          </div>
        </div>

        {/* Specs strip */}
        <div className="px-4 py-3.5 border-t border-white/5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Ref</dt>
              <dd className="text-zinc-300 font-medium mt-0.5">{watch.reference ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Caliber</dt>
              <dd className="text-zinc-300 font-medium mt-0.5">{watch.caliber ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Case</dt>
              <dd className="text-zinc-300 font-medium mt-0.5">
                {watch.case_size_mm ? `${watch.case_size_mm}mm` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Condition</dt>
              <dd className="text-zinc-300 font-medium mt-0.5">
                {watch.condition_rating ? `${watch.condition_rating}/10` : '—'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Hover hint */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-bronze-400/0 via-bronze-400 to-bronze-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </button>
  );
}
