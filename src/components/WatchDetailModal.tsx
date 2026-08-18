import { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Gauge,
  Wrench,
  Calendar,
  Ruler,
  Settings,
} from 'lucide-react';
import type { Watch } from '@/types/watch';

interface WatchDetailModalProps {
  watch: Watch | null;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '15551234567'; // Replace with studio number

const CAROUSEL_LABELS = ['Dial', 'Movement', 'Case Back', 'On-Wrist'];

export default function WatchDetailModal({ watch, onClose }: WatchDetailModalProps) {
  const [activeImage, setActiveImage] = useState(0);

  const gallery: string[] = watch?.gallery ?? (watch?.primary_image ? [watch.primary_image] : []);

  const nextImage = useCallback(() => {
    setActiveImage((i) => (i + 1) % Math.max(gallery.length, 1));
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    setActiveImage((i) => (i - 1 + Math.max(gallery.length, 1)) % Math.max(gallery.length, 1));
  }, [gallery.length]);

  useEffect(() => {
    setActiveImage(0);
  }, [watch?.id]);

  useEffect(() => {
    if (!watch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [watch, onClose, nextImage, prevImage]);

  if (!watch) return null;

  const whatsappText = encodeURIComponent(
    `Hi, I am interested in the ${watch.brand} ${watch.model} (Ref: ${watch.reference ?? 'N/A'}) listed for $${watch.price.toLocaleString()}.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  const specs = [
    { icon: Settings, label: 'Reference', value: watch.reference },
    { icon: Gauge, label: 'Caliber', value: watch.caliber },
    { icon: Wrench, label: 'Movement', value: watch.movement_type },
    { icon: Calendar, label: 'Year / Era', value: watch.era ? `${watch.era}${watch.year ? ` (${watch.year})` : ''}` : watch.year?.toString() },
    { icon: Ruler, label: 'Case Size', value: watch.case_size_mm ? `${watch.case_size_mm} mm` : null },
    { icon: Ruler, label: 'Lug Width', value: watch.lug_width_mm ? `${watch.lug_width_mm} mm` : null },
  ].filter((s) => s.value);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[100dvh] sm:max-h-[92vh] overflow-y-auto sm:rounded-3xl glass shadow-luxe ring-1 ring-white/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-ink-900/80 text-zinc-300 hover:text-zinc-50 hover:bg-ink-800 ring-1 ring-white/10 transition-all duration-300"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Carousel */}
          <div className="relative bg-ink-950">
            <div className="relative aspect-square md:aspect-auto md:h-full md:min-h-[560px] overflow-hidden">
              {gallery.length > 0 && (
                <img
                  src={gallery[activeImage]}
                  alt={`${watch.brand} ${watch.model} — ${CAROUSEL_LABELS[activeImage] ?? 'view'}`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Carousel controls */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full glass text-zinc-200 hover:text-bronze-300 ring-1 ring-white/10 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full glass text-zinc-200 hover:text-bronze-300 ring-1 ring-white/10 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Label */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-wider text-bronze-300 ring-1 ring-white/10">
                    {CAROUSEL_LABELS[activeImage] ?? 'View'}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto bg-ink-950">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-1 transition-all ${
                      i === activeImage
                        ? 'ring-bronze-400/60 opacity-100'
                        : 'ring-white/5 opacity-50 hover:opacity-80'
                    }`}
                    aria-label={`View ${CAROUSEL_LABELS[i] ?? i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    watch.status === 'Available'
                      ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                      : watch.status === 'Reserved'
                      ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30'
                  }`}
                >
                  {watch.status}
                </span>
                {watch.category && (
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                    {watch.category}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-3xl text-zinc-50 leading-tight">{watch.brand}</h2>
              <p className="text-lg text-zinc-300 mt-1">{watch.model}</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-white/5">
              <span className="text-xs uppercase tracking-wider text-zinc-500">Price</span>
              <p className="font-serif text-3xl text-gradient-bronze mt-1">
                ${watch.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            {watch.description && (
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{watch.description}</p>
            )}

            {/* Technical specs */}
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-bronze-400/80 mb-3">
                Technical Specs
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                {specs.map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="flex items-start gap-2.5">
                      <Icon className="w-4 h-4 text-bronze-400/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
                          {spec.label}
                        </dt>
                        <dd className="text-sm text-zinc-200 font-medium">{spec.value}</dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            {/* Service history */}
            {watch.service_history && (
              <div className="mb-5 p-4 rounded-xl bg-ink-800/60 ring-1 ring-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Wrench className="w-4 h-4 text-bronze-400/70" strokeWidth={1.5} />
                  <h4 className="text-xs uppercase tracking-wider text-bronze-400/80">
                    Service History
                  </h4>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{watch.service_history}</p>
              </div>
            )}

            {/* Condition & authenticity */}
            <div className="mb-6 p-4 rounded-xl bg-ink-800/60 ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-bronze-400/70" strokeWidth={1.5} />
                <h4 className="text-xs uppercase tracking-wider text-bronze-400/80">
                  Condition &amp; Authenticity
                </h4>
              </div>
              {watch.authenticity_notes && (
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  {watch.authenticity_notes}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {watch.condition_rating && (
                  <div className="text-xs">
                    <span className="text-zinc-500">Condition:</span>{' '}
                    <span className="text-zinc-200 font-medium">
                      {watch.condition_rating}/10
                    </span>
                  </div>
                )}
                {watch.timekeeping_accuracy && (
                  <div className="text-xs">
                    <span className="text-zinc-500">Accuracy:</span>{' '}
                    <span className="text-zinc-200 font-medium">
                      {watch.timekeeping_accuracy}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-gradient-to-r from-bronze-400 to-bronze-500 text-ink-950 font-semibold text-sm hover:from-bronze-300 hover:to-bronze-400 transition-all duration-300 shadow-lg shadow-bronze-500/20 hover:shadow-bronze-400/30"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
                Purchase / Inquire on WhatsApp
              </a>
              <p className="text-center text-[11px] text-zinc-500 mt-2">
                Opens a direct chat with the studio. No obligation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
