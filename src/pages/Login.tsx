import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link,useNavigate } from 'react-router-dom'
import { loginAPI } from '../api/controllers/authcontroller'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

interface FormField {
    id: string
    label: string
    type: string
    placeholder: string
}

const formFields: FormField[] = [
    { id: 'username', label: 'Email or Mobile Number', type: 'text', placeholder: 'Enter your email or mobile number' },
    { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
]
const Login = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const payload = {
                email: values.username,
                password: values.password
            }
            try {
                const res:any = await loginAPI(payload)
                localStorage.setItem('token', res?.token)
                if (res?.user) {
                  localStorage.setItem('user', JSON.stringify(res.user))
                }
                navigate('/')
            } catch (error) {
                console.log('Login error:', error)
                toast.error('Invalid Credentials!')
            } finally {
                setSubmitting(false)
            }
        },
    })
    const token = localStorage.getItem("token")
useEffect(()=>{
    if(token){
        navigate("/")
    }
},[])
    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden">
            {/* Background texture/overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-150 brightness-50" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>

            <main className="relative z-10 w-full max-w-5xl rounded-[2.5rem] bg-card shadow-[0_25px_80px_-15px_rgba(61,37,22,0.3)] border-[0.5px] border-primary/20 flex flex-col lg:flex-row overflow-hidden group">
                
                {/* Visual Section - Left Side */}
                <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-primary">
                    <img
                        src="/auth-bg.webp"
                        alt="Historical Monument"
                        loading="lazy"
                        width={450}
                        height={600}
                        className="h-full w-full object-cover opacity-80 mix-blend-multiply brightness-110 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-body/90 via-body/20 to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-10 right-10 flex flex-col gap-4">
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <h2 className="text-3xl font-serif text-card mb-2 leading-tight">Preserving Ancient Wisdom</h2>
                            <p className="text-card/80 font-medium text-sm leading-relaxed">Your portal to the world's most comprehensive archive of historical inscriptions.</p>
                        </div>
                    </div>
                    
                    {/* Decorative Corner accent */}
                    <div className="absolute top-0 left-0 p-8 h-24 w-24 border-t-4 border-l-4 border-card/30 rounded-tl-[2.5rem]"></div>
                </div>

                {/* Content Section - Right Side */}
                <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-card relative">
                    {/* Corner decorative accent */}
                    <div className="absolute top-0 right-0 p-8 h-24 w-24 border-t-4 border-r-4 border-primary/10 rounded-tr-[2.5rem]"></div>
                    
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-2xs font-black tracking-[0.2em] uppercase rounded-full mb-4">Secured Access</span>
                            <h1 className="text-4xl font-serif font-black text-body mb-3 leading-tight tracking-tight">Access the Archives</h1>
                            <p className="text-muted font-medium text-sm tracking-wide">Step back in time. Please provide your identification.</p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <label htmlFor={field.id} className="block text-2xs font-black uppercase tracking-widest text-primary/60 ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type={field.type}
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            {...formik.getFieldProps(field.id)}
                                            className={`w-full rounded-2xl border-2 transition-all duration-300 ${
                                                formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values]
                                                    ? 'border-red-400 bg-red-50/20 focus:ring-red-200'
                                                    : 'border-cream bg-[#f8f5ee] focus:border-primary/30 focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                                            } px-5 py-4 text-sm font-semibold text-body focus:outline-none focus:ring-4`}
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100"></div>
                                    </div>
                                    {formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values] && (
                                        <p className="text-2xs font-bold text-red-500 ml-2 mt-1">{formik.errors[field.id as keyof typeof formik.values]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-5 h-5 rounded-md border-2 border-primary/30 flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold text-muted group-hover:text-body transition-colors">Keep me authenticated</span>
                                </label>

                                <a href="#" className="text-xs font-black text-primary hover:opacity-70 transition-opacity uppercase tracking-tighter">Forgotten pass?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full relative group overflow-hidden bg-primary text-white py-5 rounded-2xl font-bold shadow-[0_10px_25px_-5px_rgba(139,69,19,0.3)] transition-all hover:shadow-[0_15px_35px_-8px_rgba(139,69,19,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {formik.isSubmitting ? 'Validating...' : 'Unlock Archives'}
                                    {!formik.isSubmitting && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </button>
                        </form>

                        <div className="text-right mt-2">
                            <Link to="/forgot-password" className="text-xs font-semibold text-primary/60 hover:text-primary hover:underline transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <div className="mt-8 text-center relative">
                            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
                            <span className="relative z-10 bg-card px-4 text-2xs font-black uppercase tracking-[0.3em] text-primary/40">or</span>
                        </div>

                        {/* Google Sign In */}
                        <a
                            href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/google`}
                            className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border-2 border-primary/15 bg-white hover:bg-cream/50 transition-all hover:-translate-y-0.5 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm font-bold text-body">Continue with Google</span>
                        </a>

                        <p className="mt-6 text-center text-sm font-medium text-muted">
                            New scribe?{' '}
                            <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 decoration-primary/30">
                                Enroll now
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Login