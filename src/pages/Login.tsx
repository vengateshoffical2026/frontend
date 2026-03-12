import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

type LoginFormValues = {
  identifier: string
  password: string
  rememberMe: boolean
}

const loginSchema = Yup.object({
  identifier: Yup.string().trim().required('Email or username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  rememberMe: Yup.boolean(),
})

const Login = () => {
  const [submitted, setSubmitted] = useState(false)

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (_values, { setSubmitting }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSubmitted(true)
      setSubmitting(false)
    },
  })

  const fieldClass = (field: keyof LoginFormValues) =>
    `w-full rounded-md border px-4 py-2.5 text-sm text-[#6b5d4f] placeholder:text-[#b8aa9d] bg-[#d8d0bc]/65 outline-none transition ${
      formik.touched[field] && formik.errors[field]
        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
        : 'border-[#7e6b5b] focus:ring-2 focus:ring-[#2f8678]/35 focus:border-[#2f8678]'
    }`

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#bfae98]">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div
          className="hidden bg-cover bg-center md:block"
          style={{ backgroundImage: 'url(/loginpart1.png)' }}
          aria-hidden="true"
        />
        <div
          className="hidden bg-cover bg-center md:block"
          style={{ backgroundImage: 'url(/loginpart2.png)' }}
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0 bg-[#8a6f5a]/32" aria-hidden="true" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[22px] border border-[#cabba8] bg-[#d4cfbd]/95 px-7 py-8 shadow-[0_14px_40px_rgba(44,29,15,0.24)] sm:px-10 sm:py-10">
          {/* <h1 className="mb-7 text-4xl text-[#b58f62]" style={{ fontFamily: 'serif' }}>
            ሳሳናም
          </h1> */}

          <h2 className="mb-7 text-[38px] font-semibold leading-none text-[#5a2222]">Welcome Back</h2>

          {submitted ? (
            <div className="rounded-md border border-[#2f8678]/40 bg-[#eef8f6] px-4 py-3 text-sm text-[#2f8678]">
              Logged in successfully.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
              <div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Email or Username"
                  className={fieldClass('identifier')}
                  value={formik.values.identifier}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.identifier && formik.errors.identifier ? (
                  <p className="mt-1 text-xs text-red-600">{formik.errors.identifier}</p>
                ) : null}
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className={fieldClass('password')}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="mt-1 text-xs text-red-600">{formik.errors.password}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-sm text-[#5b2a2a]">
                <label htmlFor="rememberMe" className="inline-flex items-center gap-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#8f7a67] text-[#2f8678] focus:ring-[#2f8678]/40"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                  />
                  Remember Me
                </label>

                <button type="button" className="underline underline-offset-2 hover:text-[#2f8678] transition-colors">
                  Forget Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full rounded-md bg-[#2f8678] py-2.5 text-xl font-semibold text-white transition hover:bg-[#297467] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formik.isSubmitting ? 'Logging In...' : 'Log In'}
              </button>

              <p className="pt-2 text-center text-sm font-semibold text-[#5b2a2a]">
                Don&apos;t have account?{' '}
                <Link to="/signup" className="text-[#2f8678] underline underline-offset-2 hover:text-[#256a5e]">
                  Sign up
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default Login