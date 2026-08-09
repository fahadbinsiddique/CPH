'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Languages,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { consultantService } from '@/services/consultantService'

const STEP1_FIELDS = ['full_name', 'email', 'phone_number', 'password', 'confirm_password']

// Field names are aligned with ConsultantCreateSerializer on the backend
// (account + profile are created together when the application is submitted).
const formSchema = z
  .object({
    // Step 1 — account information
    full_name: z.string().min(2, { message: 'Please enter your full name.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    phone_number: z
      .string()
      .refine(
        (v) => !v || /^(\+88|88)?01[3-9]\d{8}$/.test(v.replace(/[\s\-()]/g, '')),
        { message: 'Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX).' }
      )
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirm_password: z.string().min(6, { message: 'Please confirm your password.' }),

    // Step 2 — consultant profile
    bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
    experience_years: z.coerce.number().min(0, { message: 'Experience must be 0 or more years.' }),
    consultation_fee: z.coerce.number().min(0, { message: 'Fee must be a positive number.' }),
    location: z.string().min(2, { message: 'Location is required.' }),
    languages: z.string().min(2, { message: 'Languages are required (e.g. English, Bangla).' }),
    specializations: z.array(z.number()).min(1, { message: 'Select at least one specialization.' }),
    profile_image: z.any().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  })

const STEPS = [
  { number: 1, title: 'Your Information' },
  { number: 2, title: 'Consultant Information' },
]

const STEP_HEADINGS = {
  1: {
    title: 'Your Information',
    description:
      'We will create your therapist account so you can apply and manage your practice.',
  },
  2: {
    title: 'Consultant Information',
    description:
      'Tell us about your professional background so patients can find and trust you.',
  },
}

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

const stepTransition = { duration: 0.22, ease: 'easeOut' }

function IconField({ icon, children }) {
  return (
    <div className="relative group">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-teal-600">
        {icon}
      </div>
      {children}
    </div>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 text-[15px] text-slate-800 shadow-none transition-all hover:border-slate-300 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20'

export default function JoinTherapistForm({ mode = 'modal' }) {
  const router = useRouter()
  const scrollRef = useRef(null)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [specializationsList, setSpecializationsList] = useState([])
  const [specLoading, setSpecLoading] = useState(true)
  const [specError, setSpecError] = useState('')
  const [specRetry, setSpecRetry] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    let active = true
    consultantService
      .getSpecializations()
      .then((res) => {
        if (active) setSpecializationsList(res.data || res || [])
      })
      .catch(() => {
        if (active) setSpecError('Could not load specializations. Please retry.')
      })
      .finally(() => {
        if (active) setSpecLoading(false)
      })
    return () => {
      active = false
    }
  }, [specRetry])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [step])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      bio: '',
      experience_years: 0,
      consultation_fee: 0,
      location: '',
      languages: '',
      specializations: [],
      profile_image: null,
    },
  })

  const handleNext = async () => {
    const valid = await form.trigger(STEP1_FIELDS)
    if (valid) setStep(2)
  }

  const handleBack = () => setStep(1)

  const toggleSpecialization = (id, current) => {
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]
    form.setValue('specializations', next, { shouldValidate: true })
  }

  const handleClose = () => {
    if (mode === 'modal') {
      router.back()
    } else {
      router.push('/')
    }
  }

  const onSubmit = async (values) => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const formData = new FormData()
      formData.append('full_name', values.full_name)
      formData.append('email', values.email)
      formData.append('phone_number', values.phone_number || '')
      formData.append('password', values.password)
      formData.append('bio', values.bio)
      formData.append('experience_years', values.experience_years)
      formData.append('consultation_fee', values.consultation_fee)
      formData.append('location', values.location)
      formData.append('languages', values.languages)
      values.specializations.forEach((id) => formData.append('specializations', id))
      if (values.profile_image) formData.append('profile_image', values.profile_image)

      const response = await consultantService.create(formData)
      setSuccessMessage(
        response.data?.message ||
          'Your application has been submitted successfully. Our team will review it shortly.'
      )
      setSubmitted(true)
      form.reset()
    } catch (error) {
      // Friendly DRF error mapping — never expose raw error details.
      const data = error?.response?.data
      let message = 'Something went wrong. Please try again.'
      if (typeof data === 'string') {
        message = data
      } else if (data?.detail) {
        message = data.detail
      } else if (data?.non_field_errors?.length) {
        message = data.non_field_errors[0]
      } else if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0]
        const firstValue = data[firstKey]
        if (Array.isArray(firstValue)) message = firstValue[0]
        else if (typeof firstValue === 'string') message = firstValue
      }
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Success state replaces the whole form so entered data is never lost or reset.
  if (submitted) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center px-6 py-14 text-center sm:px-10"
        role="status"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-50"
        >
          <Check className="h-10 w-10 text-teal-700" strokeWidth={2.5} />
        </motion.div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Application Submitted
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
          {successMessage}
        </p>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
          Thank you for your interest in joining our therapist network.
        </p>
        <button type="button" onClick={handleClose} className="btn-primary mt-8 w-full sm:w-auto">
          {mode === 'modal' ? 'Close' : 'Back to Home'}
        </button>
      </div>
    )
  }

  const heading = STEP_HEADINGS[step]

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-100 bg-gradient-to-b from-teal-50/70 via-white to-white px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
        {mode !== 'modal' && (
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        )}

        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
          <Sparkles className="h-3.5 w-3.5" />
          Center for Psychological Health
        </p>
        <h1 className="mt-1.5 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
          Join as a Therapist
        </h1>
        <p className="mt-1 max-w-lg text-sm leading-relaxed text-slate-500">
          Help people through better, compassionate care.
        </p>
      </header>

      {/* Progress indicator */}
      <div className="shrink-0 border-b border-slate-100 bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto w-full max-w-xl">
          <ol className="flex items-start gap-2 sm:gap-3">
            {STEPS.map((stepItem, index) => {
              const isActive = step === stepItem.number
              const isComplete = step > stepItem.number
              return (
                <Fragment key={stepItem.number}>
                  <li className="flex flex-1 flex-col items-start">
                    <div className="flex w-full items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={[
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
                          isComplete
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : isActive
                              ? 'border-teal-600 bg-white text-teal-700'
                              : 'border-slate-200 bg-slate-50 text-slate-400',
                        ].join(' ')}
                      >
                        {isComplete ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : stepItem.number}
                      </span>
                      {index < STEPS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={[
                            'h-0.5 flex-1 rounded-full transition-colors duration-300',
                            isComplete ? 'bg-teal-500' : 'bg-slate-200',
                          ].join(' ')}
                        />
                      )}
                    </div>
                    <p
                      className={[
                        'mt-1.5 text-xs font-semibold transition-colors',
                        isActive || isComplete ? 'text-teal-700' : 'text-slate-400',
                      ].join(' ')}
                    >
                      {stepItem.title}
                    </p>
                  </li>
                </Fragment>
              )
            })}
          </ol>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Step {step} of {STEPS.length}
          </p>
        </div>
      </div>

      {/* Form body — scrolls independently while the footer stays put */}
      <div
        ref={scrollRef}
        className="cph-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-xl" noValidate>
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  variants={stepMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                >
                  <StepHeading heading={heading} />

                  <div className="mt-5 space-y-4">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Full Name <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<User className="h-[18px] w-[18px]" />}>
                              <Input
                                placeholder="Jane Smith"
                                autoComplete="name"
                                aria-label="Full name"
                                data-join-focus=""
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Email Address <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<Mail className="h-[18px] w-[18px]" />}>
                              <Input
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                aria-label="Email address"
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Phone Number <span className="font-normal normal-case text-slate-400">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<Phone className="h-[18px] w-[18px]" />}>
                              <Input
                                type="tel"
                                placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                                autoComplete="tel"
                                aria-label="Phone number"
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Password <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 transition-colors group-focus-within:text-teal-600">
                                <Lock className="h-[18px] w-[18px]" />
                              </div>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                aria-label="Password"
                                className={inputClass + ' pr-12'}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Confirm Password <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<Lock className="h-[18px] w-[18px]" />}>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                aria-label="Confirm password"
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  variants={stepMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={stepTransition}
                >
                  <StepHeading heading={heading} />

                  <div className="mt-5 space-y-4">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Professional Bio <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell patients about your qualifications, experience and approach..."
                              rows={4}
                              aria-label="Professional bio"
                              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-[15px] text-slate-800 transition-all hover:border-slate-300 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="experience_years"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Experience (Years) <RequiredStar />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="e.g. 5"
                                aria-label="Experience in years"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="consultation_fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                              Consultation Fee ($/৳) <RequiredStar />
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                placeholder="e.g. 1500"
                                aria-label="Consultation fee"
                                className={inputClass}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Location <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<MapPin className="h-[18px] w-[18px]" />}>
                              <Input
                                placeholder="City, Country"
                                aria-label="Location"
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="languages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Languages <RequiredStar />
                          </FormLabel>
                          <FormControl>
                            <IconField icon={<Languages className="h-[18px] w-[18px]" />}>
                              <Input
                                placeholder="English, Bangla"
                                aria-label="Languages spoken"
                                className={inputClass}
                                {...field}
                              />
                            </IconField>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specializations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Specializations <RequiredStar />
                          </FormLabel>
                          <div
                            role="group"
                            aria-label="Specializations"
                            className="cph-scroll max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white"
                          >
                            {specLoading ? (
                              <span className="flex items-center justify-center px-4 py-6 text-sm text-slate-400">
                                Loading specializations...
                              </span>
                            ) : specError ? (
                              <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                                <span className="text-sm text-red-600">{specError}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSpecLoading(true)
                                    setSpecError('')
                                    setSpecRetry((n) => n + 1)
                                  }}
                                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                                >
                                  Retry
                                </button>
                              </div>
                            ) : specializationsList.length === 0 ? (
                              <span className="flex items-center justify-center px-4 py-6 text-sm text-slate-400">
                                No specializations available yet. Please try again later.
                              </span>
                            ) : (
                              specializationsList.map((spec) => {
                                const selected = field.value.includes(spec.id)
                                return (
                                  <button
                                    key={spec.id}
                                    type="button"
                                    onClick={() => toggleSpecialization(spec.id, field.value)}
                                    aria-pressed={selected}
                                    className={[
                                      'flex w-full items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 text-left text-sm font-medium transition-colors last:border-b-0',
                                      selected
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-700 hover:bg-slate-50',
                                    ].join(' ')}
                                  >
                                    <span>{spec.name}</span>
                                    {selected && <Check className="h-4 w-4 shrink-0 text-teal-600" />}
                                  </button>
                                )
                              })
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            Scroll and select your specializations.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile_image"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Profile Image <span className="font-normal normal-case text-slate-400">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              aria-label="Profile image"
                              onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] text-slate-800 transition-all file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-teal-700 hover:border-slate-300"
                              {...fieldProps}
                            />
                          </FormControl>
                          <p className="text-xs text-slate-400">
                            Optional — a professional headshot helps patients feel connected.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mt-5 rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm font-medium text-red-600"
              >
                {submitError}
              </motion.div>
            )}
          </form>
        </Form>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-slate-100 bg-white/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="btn-outline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <div className="flex-1" />
          {step === 1 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={form.handleSubmit(onSubmit)} type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

function StepHeading({ heading }) {
  return (
    <div>
      <h2 className="font-heading text-lg font-bold text-slate-900">{heading.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{heading.description}</p>
    </div>
  )
}

function RequiredStar() {
  return <span className="text-teal-700">*</span>
}
