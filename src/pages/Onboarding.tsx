import { ArrowRight, Plus, Send, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { OptionButton } from '../components/ui'
import { companyOptions, discoveryOptions, interests } from '../data/seed'
import { shareInvite } from '../services/share'
import { profileStore, toggleIn } from '../services/store'
import type { Profile } from '../types'

const emptyProfile: Profile = { name: '', interests: [], company: [], discovery: 'mix', favourites: [] }

export function Onboarding() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const editing = params.has('edit')
  const existing = profileStore.use()
  const [step, setStep] = useState(editing ? 1 : 0)
  const [draft, setDraft] = useState<Profile>(existing ?? emptyProfile)
  const [favourite, setFavourite] = useState('')
  const [inviteStatus, setInviteStatus] = useState('')

  if (existing && !editing && step === 0) return <Navigate to="/today" replace />

  const update = (patch: Partial<Profile>) => setDraft(d => ({ ...d, ...patch }))
  const canContinue = step !== 1 || draft.interests.length > 0

  function addFavourite() {
    const name = favourite.trim()
    if (!name || draft.favourites.includes(name)) return
    update({ favourites: [...draft.favourites, name] })
    setFavourite('')
  }

  function finish() {
    const pending = favourite.trim()
    const favourites = pending && !draft.favourites.includes(pending) ? [...draft.favourites, pending] : draft.favourites
    profileStore.set({ ...draft, name: draft.name.trim(), favourites })
    nav(editing ? '/profile' : '/today', { replace: true })
  }

  async function invite() {
    const result = await shareInvite()
    setInviteStatus(result === 'copied' ? 'Invite link copied' : result === 'shared' ? 'Invite shared' : 'Could not share the link')
  }

  if (step === 0) {
    return (
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10">
        <p className="text-sm font-semibold tracking-[.3em]">PLACE</p>
        <div className="float-in">
          <h1 className="text-[clamp(2.8rem,13vw,4.2rem)] font-light leading-[.95] tracking-[-.04em]">
            Find your<br /><em className="font-serif">third place.</em>
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-7 text-muted">
            The spots between home and work where you feel at ease. Discover hidden gems that locals love, and share your own.
          </p>
        </div>
        <button onClick={() => setStep(1)} className="flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-white">
          Get started <ArrowRight size={20} />
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <div className="flex items-center justify-between">
        <button onClick={() => (step === 1 && editing ? nav(-1) : setStep(step - 1))} className="py-2 text-sm text-muted hover:text-ink">Back</button>
        <p className="text-xs text-faint">Step {step} of 3</p>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {[1, 2, 3].map(n => <span key={n} className={`h-1 flex-1 rounded-full ${n <= step ? 'bg-ink' : 'bg-ink/10'}`} />)}
      </div>

      <div className="float-in flex-1 pt-9" key={step}>
        {step === 1 && (
          <>
            <label htmlFor="name" className="text-2xl font-light">What should we call you?</label>
            <input
              id="name"
              value={draft.name}
              onChange={e => update({ name: e.target.value })}
              placeholder="Your first name"
              autoComplete="given-name"
              className="mt-4 w-full rounded-2xl border border-line bg-card px-4 py-3.5 outline-none focus:border-ink"
            />
            <h2 className="mt-9 text-2xl font-light">Which places do you enjoy?</h2>
            <p className="mt-1.5 text-sm text-muted">Pick as many as you like. Tap again to remove.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {interests.map(i => (
                <OptionButton key={i.id} label={i.label} selected={draft.interests.includes(i.id)} onClick={() => update({ interests: toggleIn(draft.interests, i.id) })} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-light">Who do you usually go out with?</h2>
            <p className="mt-1.5 text-sm text-muted">Pick any that apply.</p>
            <div className="mt-4 space-y-2">
              {companyOptions.map(c => (
                <OptionButton key={c.id} label={c.label} selected={draft.company.includes(c.id)} onClick={() => update({ company: toggleIn(draft.company, c.id) })} />
              ))}
            </div>
            <h2 className="mt-9 text-2xl font-light">What kind of spots do you prefer?</h2>
            <div className="mt-4 space-y-2">
              {discoveryOptions.map(d => (
                <OptionButton key={d.id} label={d.label} hint={d.hint} selected={draft.discovery === d.id} onClick={() => update({ discovery: d.id })} />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-light">Do you have a favourite spot?</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted">Name a few places you love. You can add them to the map later so others can find them too.</p>
            <form onSubmit={e => { e.preventDefault(); addFavourite() }} className="mt-4 flex gap-2">
              <input
                value={favourite}
                onChange={e => setFavourite(e.target.value)}
                placeholder="e.g. a quiet café or a bench by the water"
                aria-label="Favourite place"
                className="min-w-0 flex-1 rounded-2xl border border-line bg-card px-4 py-3.5 outline-none focus:border-ink"
              />
              <button type="submit" disabled={!favourite.trim()} aria-label="Add favourite" className="rounded-2xl bg-ink px-4 text-white disabled:opacity-30">
                <Plus size={20} />
              </button>
            </form>
            {draft.favourites.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {draft.favourites.map(f => (
                  <li key={f} className="flex items-center gap-1 rounded-full bg-sand py-1.5 pl-3.5 pr-1.5 text-sm">
                    {f}
                    <button onClick={() => update({ favourites: draft.favourites.filter(x => x !== f) })} aria-label={`Remove ${f}`} className="rounded-full p-1 hover:bg-black/10">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-10 text-2xl font-light">Bring your friends</h2>
            <p className="mt-1.5 text-sm leading-6 text-muted">PLACE is better with people you know. Friends can see your mood and friends-only places; nobody else can.</p>
            <button onClick={invite} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink px-5 py-3.5 text-sm font-medium">
              <Send size={16} /> Invite friends
            </button>
            {inviteStatus && <p role="status" className="mt-2 text-center text-xs text-muted">{inviteStatus}</p>}
          </>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {step === 3 && !editing && <button onClick={finish} className="px-4 py-4 text-sm text-muted hover:text-ink">Skip</button>}
        <button
          onClick={() => (step === 3 ? finish() : setStep(step + 1))}
          disabled={!canContinue}
          className="flex flex-1 items-center justify-between rounded-full bg-ink px-6 py-4 text-white disabled:opacity-30"
        >
          {step === 3 ? (editing ? 'Save changes' : 'Start exploring') : 'Continue'} <ArrowRight size={19} />
        </button>
      </div>
      {step === 1 && !canContinue && <p className="mt-2 text-center text-xs text-faint">Choose at least one kind of place to continue.</p>}
    </section>
  )
}
