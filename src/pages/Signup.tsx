import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signupAPI } from "../api/controllers/authcontroller";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export interface SignupData {
  fullName: string
  email: string
  password: string
}
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
    .required("Please confirm your password")
});

const SignupForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const payload: SignupData = {
                fullName: values.fullName,
                email: values.email,
                password: values.password
            }
            try {
                const res: any = await signupAPI(payload);
                toast.success("Account created successfully!");
                navigate("/login");
                console.log(res)
            } catch (err: any) {
                toast.error(err.response?.data?.error || "Failed to create account. Please try again.")
            }
        },
    });

    const getFieldClass = (field: keyof typeof formik.values) =>
        `w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
            formik.touched[field] && formik.errors[field]
                ? "border-red-400 bg-red-50/20 focus:ring-red-200 shadow-none"
                : "border-[#f4ecd8] bg-[#f8f5ee] focus:border-[#8B4513]/30 focus:bg-white focus:ring-[#8B4513]/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
        } text-[#4A3B32] placeholder-[#A78E7E] text-sm font-semibold focus:outline-none focus:ring-4`;

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden">
            {/* Background texture/overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-150 brightness-50" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>

            <main className="relative z-10 w-full max-w-5xl rounded-[2.5rem] bg-[#fdfaf2] shadow-[0_25px_80px_-15px_rgba(61,37,22,0.3)] border-[0.5px] border-[#8B4513]/20 flex flex-col lg:flex-row-reverse overflow-hidden group">
                
                {/* Visual Section - Right Side */}
                <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-[#8B4513]">
                    <img
                        src="/auth-bg.png"
                        alt="Historical Monument"
                        className="h-full w-full object-cover opacity-80 mix-blend-multiply brightness-110 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B32]/90 via-[#4A3B32]/20 to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-10 right-10 flex flex-col gap-4">
                        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <h2 className="text-3xl font-serif text-[#fdfaf2] mb-2 leading-tight">Begin Your Journey</h2>
                            <p className="text-[#fdfaf2]/80 font-medium text-sm leading-relaxed">Join a global community of historians, scholars, and explorers dedicated to uncovering lost history.</p>
                        </div>
                    </div>
                </div>

                {/* Content Section - Left Side */}
                <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#fdfaf2] relative">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <span className="inline-block px-3 py-1 bg-[#8B4513]/10 text-[#8B4513] text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-4">Enrollment Form</span>
                            <h1 className="text-4xl font-serif font-black text-[#4A3B32] mb-3 leading-tight tracking-tight">Become a Scribe</h1>
                            <p className="text-[#6A5A4A] font-medium text-sm tracking-wide">Enter the lineage of those who record history.</p>
                        </div>

                        {submitted ? (
                            <div className="text-center py-12 bg-green-50/30 rounded-[2rem] border border-green-100">
                                <div className="text-6xl mb-6">🖋️</div>
                                <p className="text-[#8B4513] font-serif text-2xl font-black mb-2">Registry Successful</p>
                                <p className="text-[#6A5A4A] text-sm">Welcome to the archives.</p>
                                <button onClick={() => navigate("/login")} className="mt-8 text-[#8B4513] font-black uppercase tracking-widest text-xs border-b-2 border-[#8B4513]/30 pb-1 hover:border-[#8B4513] transition-all">Proceed to Gates</button>
                            </div>
                        ) : (
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                
                                <div className="space-y-1">
                                    <label htmlFor="fullName" className="block text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Full Identity</label>
                                    <input id="fullName" type="text" placeholder="e.g. Samuel Silas" className={getFieldClass("fullName")} {...formik.getFieldProps("fullName")} />
                                    {formik.touched.fullName && formik.errors.fullName && <p className="text-[10px] font-bold text-red-500 ml-2">{formik.errors.fullName}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Comm Channel (Email)</label>
                                    <input id="email" type="email" placeholder="you@domain.com" className={getFieldClass("email")} {...formik.getFieldProps("email")} />
                                    {formik.touched.email && formik.errors.email && <p className="text-[10px] font-bold text-red-500 ml-2">{formik.errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1">
                                        <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Passphrase</label>
                                        <input id="password" type="password" placeholder="••••••••" className={getFieldClass("password")} {...formik.getFieldProps("password")} />
                                        {formik.touched.password && formik.errors.password && <p className="text-[10px] font-bold text-red-500 ml-2">{formik.errors.password}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="confirmPassword" className="block text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">Validate</label>
                                        <input id="confirmPassword" type="password" placeholder="••••••••" className={getFieldClass("confirmPassword")} {...formik.getFieldProps("confirmPassword")} />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-2">{formik.errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                <div className="py-4">
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="relative mt-1 flex-shrink-0">
                                            <input type="checkbox" className="sr-only peer" {...formik.getFieldProps("terms")} />
                                            <div className="w-5 h-5 rounded-md border-2 border-[#8B4513]/30 flex items-center justify-center transition-all peer-checked:bg-[#8B4513] peer-checked:border-[#8B4513]">
                                                <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#6A5A4A] leading-relaxed select-none">
                                            I solemnly swear to abide by the <a href="#" className="text-[#8B4513] font-black hover:underline">Vows of Preservation</a> and platform terms.
                                        </span>
                                    </label>
                                    {formik.touched.terms && formik.errors.terms && <p className="text-[10px] font-bold text-red-500 ml-10 mt-1">{formik.errors.terms}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="w-full relative group overflow-hidden bg-[#8B4513] text-white py-5 rounded-2xl font-bold shadow-[0_10px_25px_-5px_rgba(139,69,19,0.3)] transition-all hover:shadow-[0_15px_35px_-8px_rgba(139,69,19,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {formik.isSubmitting ? 'Recording Registry...' : 'Enter the Lineage'}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                </button>

                                <p className="mt-8 text-center text-sm font-medium text-[#6A5A4A]">
                                    Already recognized?{' '}
                                    <Link to="/login" className="text-[#8B4513] font-bold hover:underline decoration-2 underline-offset-4 decoration-[#8B4513]/30">
                                        Log in
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignupForm;