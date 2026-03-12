import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  terms: Yup.boolean()
    .oneOf([true], "You must agree to the Terms & Conditions")
    .required(),
});

const  SignupForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
      }, 600);
    },
  });

  const getFieldClass = (field: keyof typeof formik.values) =>
    `w-full px-4 py-3 rounded-lg border bg-[#f5f0e8] text-[#5a4a3a] placeholder-[#b0a090] text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
      formik.touched[field] && formik.errors[field]
        ? "border-red-400 focus:ring-red-200"
        : "border-[#d4c9b0] focus:ring-[#4a8c7e]/30 focus:border-[#4a8c7e]"
    }`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#bfae98]">
      <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2">
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
        <h1 className="text-2xl font-bold text-[#5a3e28] mb-6 font-serif">
          Signup
        </h1>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-[#4a8c7e] font-semibold text-lg">Account Created!</p>
            <p className="text-[#7a6a5a] text-sm mt-1">Welcome aboard.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 text-sm text-[#4a8c7e] underline hover:opacity-75 transition"
            >
              Back to Signup
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">

            {/* Full Name */}
            <div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full Name"
                className={getFieldClass("fullName")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="mt-1 text-xs text-red-500 pl-1">{formik.errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                className={getFieldClass("email")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500 pl-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className={getFieldClass("password")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-500 pl-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={getFieldClass("confirmPassword")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 pl-1">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-1">
              <label className="flex items-start gap-2 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <div
                    onClick={() => formik.setFieldValue("terms", !formik.values.terms)}
                    onBlur={() => formik.setFieldTouched("terms", true)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      formik.values.terms
                        ? "bg-[#4a8c7e] border-[#4a8c7e]"
                        : formik.touched.terms && formik.errors.terms
                        ? "border-red-400 bg-white"
                        : "border-[#b0a090] bg-[#f5f0e8] group-hover:border-[#4a8c7e]"
                    }`}
                  >
                    {formik.values.terms && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#5a4a3a] leading-tight select-none">
                  I agree to the{" "}
                  <a href="#" className="underline text-[#5a4a3a] hover:text-[#4a8c7e] transition-colors font-medium">
                    Terms &amp; Conditions
                  </a>
                </span>
              </label>
              {formik.touched.terms && formik.errors.terms && (
                <p className="mt-1 text-xs text-red-500 pl-1">{formik.errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="mt-2 w-full py-3 rounded-lg bg-[#4a8c7e] hover:bg-[#3a7a6c] active:bg-[#2d6a5c] text-white font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-[#7a6a5a] mt-1">
              Already have an account?{" "}
              <a href="#" className="text-[#4a8c7e] font-semibold hover:underline transition-colors">
                Log in
              </a>
            </p>
          </form>
        )}
        </div>
      </section>
    </main>
  );
}

export default SignupForm;