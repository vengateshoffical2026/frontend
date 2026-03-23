import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI } from '../api/controllers/authcontroller'
import { toast } from 'react-toastify'

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

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-hidden">
            {/* Background texture/overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale contrast-150 brightness-50" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>

            <main className="relative z-10 w-full max-w-5xl rounded-[2.5rem] bg-[#fdfaf2] shadow-[0_25px_80px_-15px_rgba(61,37,22,0.3)] border-[0.5px] border-[#8B4513]/20 flex flex-col lg:flex-row overflow-hidden group">
                
                {/* Visual Section - Left Side */}
                <div className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-[#8B4513]">
                    <img
                        src="/auth-bg.png"
                        alt="Historical Monument"
                        className="h-full w-full object-cover opacity-80 mix-blend-multiply brightness-110 transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A3B32]/90 via-[#4A3B32]/20 to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-10 right-10 flex flex-col gap-4">
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <h2 className="text-3xl font-serif text-[#fdfaf2] mb-2 leading-tight">Preserving Ancient Wisdom</h2>
                            <p className="text-[#fdfaf2]/80 font-medium text-sm leading-relaxed">Your portal to the world's most comprehensive archive of historical inscriptions.</p>
                        </div>
                    </div>
                    
                    {/* Decorative Corner accent */}
                    <div className="absolute top-0 left-0 p-8 h-24 w-24 border-t-4 border-l-4 border-[#fdfaf2]/30 rounded-tl-[2.5rem]"></div>
                </div>

                {/* Content Section - Right Side */}
                <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#fdfaf2] relative">
                    {/* Corner decorative accent */}
                    <div className="absolute top-0 right-0 p-8 h-24 w-24 border-t-4 border-r-4 border-[#8B4513]/10 rounded-tr-[2.5rem]"></div>
                    
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center lg:text-left">
                            <span className="inline-block px-3 py-1 bg-[#8B4513]/10 text-[#8B4513] text-[10px] font-black tracking-[0.2em] uppercase rounded-full mb-4">Secured Access</span>
                            <h1 className="text-4xl font-serif font-black text-[#4A3B32] mb-3 leading-tight tracking-tight">Access the Archives</h1>
                            <p className="text-[#6A5A4A] font-medium text-sm tracking-wide">Step back in time. Please provide your identification.</p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <label htmlFor={field.id} className="block text-[10px] font-black uppercase tracking-widest text-[#8B4513]/60 ml-1">
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
                                                    : 'border-[#f4ecd8] bg-[#f8f5ee] focus:border-[#8B4513]/30 focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                                            } px-5 py-4 text-sm font-semibold text-[#4A3B32] focus:outline-none focus:ring-4`}
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#8B4513]/20 to-transparent scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100"></div>
                                    </div>
                                    {formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values] && (
                                        <p className="text-[10px] font-bold text-red-500 ml-2 mt-1">{formik.errors[field.id as keyof typeof formik.values]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-5 h-5 rounded-md border-2 border-[#8B4513]/30 flex items-center justify-center transition-all peer-checked:bg-[#8B4513] peer-checked:border-[#8B4513]">
                                        <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-bold text-[#6A5A4A] group-hover:text-[#4A3B32] transition-colors">Keep me authenticated</span>
                                </label>

                                <a href="#" className="text-xs font-black text-[#8B4513] hover:opacity-70 transition-opacity uppercase tracking-tighter">Forgotten pass?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full relative group overflow-hidden bg-[#8B4513] text-white py-5 rounded-2xl font-bold shadow-[0_10px_25px_-5px_rgba(139,69,19,0.3)] transition-all hover:shadow-[0_15px_35px_-8px_rgba(139,69,19,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {formik.isSubmitting ? 'Validating...' : 'Unlock Archives'}
                                    {!formik.isSubmitting && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </button>
                        </form>

                        <div className="mt-12 text-center relative">
                            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#8B4513]/10 to-transparent"></div>
                            <span className="relative z-10 bg-[#fdfaf2] px-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#8B4513]/40">No connection?</span>
                        </div>

                        <p className="mt-8 text-center text-sm font-medium text-[#6A5A4A]">
                            New scribe?{' '}
                            <Link to="/signup" className="text-[#8B4513] font-bold hover:underline decoration-2 underline-offset-4 decoration-[#8B4513]/30">
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