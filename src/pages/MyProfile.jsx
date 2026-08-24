import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { ErrorBanner, LoadingBlock } from '../components/Feedback'
import Reveal from '../components/Reveal'

const SKILLS = ['Electrician', 'Mason', 'Painter', 'Plumber', 'Mover', 'Carpenter', 'Welder', 'Gardener']
const MAX_IMAGE_MB = 5

export default function MyProfile() {
  const { currentUser, profile } = useAuth()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const [form, setForm] = useState({
    skills: [],
    dailyRate: '',
    bio: '',
    availability: 'available',
    photoUrl: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (!currentUser) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const snap = await getDoc(doc(db, 'workerProfiles', currentUser.uid))
        if (!cancelled && snap.exists()) {
          const data = snap.data()
          setForm({
            skills: data.skills || [],
            dailyRate: data.dailyRate ? String(data.dailyRate) : '',
            bio: data.bio || '',
            availability: data.availability || 'available',
            photoUrl: data.photoUrl || '',
          })
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setLoadError('Couldn\u2019t load your existing profile. You can still fill this in fresh.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [currentUser])

  function toggleSkill(skill) {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
    }))
    setFieldErrors((e) => ({ ...e, skills: null }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFieldErrors((e2) => ({ ...e2, photo: 'Please choose an image file.' }))
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setFieldErrors((e2) => ({ ...e2, photo: `Image must be under ${MAX_IMAGE_MB}MB.` }))
      return
    }
    setFieldErrors((e2) => ({ ...e2, photo: null }))
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function validate() {
    const errs = {}
    if (form.skills.length === 0) errs.skills = 'Pick at least one skill.'
    const rate = Number(form.dailyRate)
    if (!form.dailyRate || Number.isNaN(rate) || rate <= 0) errs.dailyRate = 'Enter a valid daily rate.'
    if (form.bio.length > 400) errs.bio = 'Keep it under 400 characters.'
    setFieldErrors((e) => ({ ...e, ...errs }))
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaveError(null)
    setSaved(false)
    if (!validate()) return

    setSaving(true)
    try {
      let photoUrl = form.photoUrl
      if (photoFile) {
        const storageRef = ref(storage, `worker-photos/${currentUser.uid}`)
        await uploadBytes(storageRef, photoFile)
        photoUrl = await getDownloadURL(storageRef)
      }

      await setDoc(
        doc(db, 'workerProfiles', currentUser.uid),
        {
          uid: currentUser.uid,
          name: profile?.name || currentUser.displayName || '',
          city: profile?.city || '',
          skills: form.skills,
          dailyRate: Number(form.dailyRate),
          bio: form.bio.trim(),
          availability: form.availability,
          photoUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
      setSaved(true)
    } catch (err) {
      console.error(err)
      setSaveError('Couldn\u2019t save your profile. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingBlock label="Loading your profile" />

  return (
    <Reveal>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-safety-dark mb-2">Worker profile</p>
        <h1 className="font-display text-4xl uppercase mb-8">List your skills</h1>

        {loadError && <div className="mb-6"><ErrorBanner message={loadError} /></div>}
        {saveError && <div className="mb-6"><ErrorBanner message={saveError} onRetry={handleSubmit} /></div>}
        {saved && (
          <div className="mb-6 border-2 border-trust/40 bg-trust/5 text-trust px-4 py-3 rounded-md text-sm font-medium">
            Profile saved. Employers can now find you in search.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <span className="block text-sm font-medium mb-2">Skills</span>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  aria-pressed={form.skills.includes(skill)}
                  className={`border-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    form.skills.includes(skill)
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line text-ink-soft hover:border-ink'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {fieldErrors.skills && <p className="text-xs text-danger mt-2">{fieldErrors.skills}</p>}
          </div>

          <label className="block">
            <span className="block text-sm font-medium mb-1">Daily rate (₹)</span>
            <input
              type="number"
              min="1"
              className={`w-48 border-2 rounded-md px-3 py-2.5 bg-paper-dim focus:outline-none ${fieldErrors.dailyRate ? 'border-danger' : 'border-line focus:border-ink'}`}
              value={form.dailyRate}
              onChange={(e) => { setForm((f) => ({ ...f, dailyRate: e.target.value })); setFieldErrors((er) => ({ ...er, dailyRate: null })) }}
            />
            {fieldErrors.dailyRate && <p className="text-xs text-danger mt-1">{fieldErrors.dailyRate}</p>}
          </label>

          <fieldset className="flex gap-2" role="radiogroup" aria-label="Availability">
            {[
              { value: 'available', label: 'Available now' },
              { value: 'busy', label: 'Currently busy' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm((f) => ({ ...f, availability: opt.value }))}
                aria-pressed={form.availability === opt.value}
                className={`border-2 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                  form.availability === opt.value ? 'border-trust bg-trust/10 text-trust' : 'border-line text-ink-soft hover:border-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </fieldset>

          <label className="block">
            <span className="block text-sm font-medium mb-1">About you (optional)</span>
            <textarea
              rows={4}
              maxLength={400}
              className={`w-full border-2 rounded-md px-3 py-2.5 bg-paper-dim focus:outline-none resize-none ${fieldErrors.bio ? 'border-danger' : 'border-line focus:border-ink'}`}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Years of experience, tools you bring, specialties\u2026"
            />
            <span className="block text-xs text-ink-soft mt-1">{form.bio.length}/400</span>
          </label>

          <label className="block">
            <span className="block text-sm font-medium mb-1">Photo (optional)</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="block text-sm" />
            {fieldErrors.photo && <p className="text-xs text-danger mt-1">{fieldErrors.photo}</p>}
            {(photoPreview || form.photoUrl) && (
              <img
                src={photoPreview || form.photoUrl}
                alt="Profile preview"
                className="mt-3 h-24 w-24 object-cover rounded-md border-2 border-line"
              />
            )}
          </label>

          <button
            type="submit"
            disabled={saving}
            className="bg-safety-dark text-paper font-mono text-sm uppercase tracking-wide px-6 py-3 rounded hover:bg-ink transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving\u2026' : 'Save profile'}
          </button>
        </form>
      </div>
    </Reveal>
  )
}