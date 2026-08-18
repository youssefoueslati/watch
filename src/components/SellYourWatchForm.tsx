import { useState, type FormEvent } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { WatchSubmission } from '@/types/watch';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function SellYourWatchForm() {
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    brand: '',
    model: '',
    asking_price: '',
    photo_urls: '',
    contact_name: '',
    contact_email: '',
    notes: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const payload: WatchSubmission = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      asking_price: form.asking_price ? parseFloat(form.asking_price) : null,
      photo_urls: form.photo_urls.trim() || null,
      contact_name: form.contact_name.trim() || null,
      contact_email: form.contact_email.trim() || null,
      notes: form.notes.trim() || null,
    };

    if (!payload.brand || !payload.model) {
      setState('error');
      setErrorMsg('Brand and model are required.');
      return;
    }

    try {
      const { error } = await supabase.from('watch_submissions').insert([payload]);
      if (error) throw error;

      // Fire webhook (best-effort — do not block success on webhook failure)
      if (WEBHOOK_URL) {
        try {
          await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch {
          /* webhook is best-effort */
        }
      }

      setState('success');
      setForm({
        brand: '',
        model: '',
        asking_price: '',
        photo_urls: '',
        contact_name: '',
        contact_email: '',
        notes: '',
      });
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (state === 'success') {
    return (
      <div className="text-center py-12 px-6 rounded-2xl bg-ink-850 ring-1 ring-emerald-500/20">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h3 className="font-serif text-2xl text-zinc-50 mb-2">Submission Received</h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Thank you. Our studio will review your timepiece and reach out within 48 hours with an
          evaluation.
        </p>
        <button
          onClick={() => setState('idle')}
          className="mt-6 px-5 py-2 rounded-full text-sm text-bronze-300 ring-1 ring-bronze-400/30 hover:bg-bronze-400/10 transition-colors"
        >
          Submit another watch
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Brand" required>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => update('brand', e.target.value)}
            placeholder="e.g. Omega"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Model" required>
          <input
            type="text"
            value={form.model}
            onChange={(e) => update('model', e.target.value)}
            placeholder="e.g. Seamaster 300"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Asking Price (USD)">
          <input
            type="number"
            min="0"
            step="50"
            value={form.asking_price}
            onChange={(e) => update('asking_price', e.target.value)}
            placeholder="e.g. 1200"
            className={inputClass}
          />
        </Field>
        <Field label="Your Name">
          <input
            type="text"
            value={form.contact_name}
            onChange={(e) => update('contact_name', e.target.value)}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          value={form.contact_email}
          onChange={(e) => update('contact_email', e.target.value)}
          placeholder="you@email.com"
          className={inputClass}
        />
      </Field>

      <Field label="Photo URL">
        <div className="relative">
          <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            type="url"
            value={form.photo_urls}
            onChange={(e) => update('photo_urls', e.target.value)}
            placeholder="https://… link to a photo of your watch"
            className={`${inputClass} pl-9`}
          />
        </div>
      </Field>

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={4}
          placeholder="Condition, service history, box & papers, anything we should know…"
          className={`${inputClass} resize-none`}
        />
      </Field>

      {state === 'error' && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20 text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-gradient-to-r from-bronze-400 to-bronze-500 text-ink-950 font-semibold text-sm hover:from-bronze-300 hover:to-bronze-400 transition-all duration-300 shadow-lg shadow-bronze-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit for Evaluation
          </>
        )}
      </button>
    </form>
  );
}

const inputClass =
  'w-full px-4 py-3 text-sm bg-ink-800/60 border border-white/5 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-bronze-400/40 focus:ring-1 focus:ring-bronze-400/20 transition-all duration-300';

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
        {label}
        {required && <span className="text-bronze-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
