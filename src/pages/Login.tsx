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
                localStorage.setItem('token', res?.data?.token)
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
        <main className="min-h-screen bg-[#e4d3be] font-sans text-[#4f1f1f] bg-cover bg-center flex items-center justify-center p-4 sm:p-8" style={{ backgroundImage: 'url(/homebg.png)' }}>
            <div className="absolute inset-0 bg-[#f1e4d7]/70 backdrop-blur-[2px]"></div>
            
            <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#d5ceb9]/80 shadow-[0_8px_32px_rgba(61,37,22,0.15)] backdrop-blur-xl border border-white/30 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Side */}
                    <div className="hidden lg:block relative p-2 h-full">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-white/20 relative">
                            <img
                                src="/loginBanner.png"
                                alt="Vintage writing desk"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4f1f1f]/60 to-transparent rounded-2xl"></div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <h2 className="text-3xl font-serif text-[#f1e4d7] drop-shadow-md">Unveil the Archives</h2>
                                <p className="mt-2 text-[#e4d3be]">Access centuries of preserved history.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                        <Link to="/" className="w-fit mb-8 inline-flex items-center text-sm font-bold text-[#b78b61] hover:text-[#4f1f1f] transition-colors">
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#4f1f1f] mb-3">Welcome Back</h1>
                            <p className="text-[#5c2a2a] font-medium text-sm sm:text-base">Please enter your credentials to access the archives.</p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {formFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <label htmlFor={field.id} className="block text-sm font-bold text-[#4f1f1f]">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        {...formik.getFieldProps(field.id)}
                                        className={`w-full rounded-xl border ${
                                            formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values]
                                                ? 'border-red-400 bg-red-50/50 focus:ring-red-400'
                                                : 'border-white/30 bg-white/40 focus:border-[#2e8578] focus:ring-[#2e8578]'
                                        } px-4 py-3.5 text-sm sm:text-base text-[#4f1f1f] shadow-inner placeholder:text-[#8a7f6a] focus:outline-none focus:ring-2`}
                                    />
                                    {formik.touched[field.id as keyof typeof formik.values] && formik.errors[field.id as keyof typeof formik.values] && (
                                        <p className="text-xs font-bold text-red-500">{formik.errors[field.id as keyof typeof formik.values]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="h-5 w-5 rounded-md border-2 border-white/50 bg-white/30 transition-all peer-checked:border-[#2e8578] peer-checked:bg-[#2e8578] group-hover:border-[#2e8578]"></div>
                                        <svg className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-[#5c2a2a] group-hover:text-[#4f1f1f] transition-colors">Remember me</span>
                                </label>

                                <a href="#" className="text-sm font-bold text-[#b78b61] hover:text-[#4f1f1f] transition-colors">
                                    Forgot Password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full rounded-xl bg-[#2e8578] py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#256a5e] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {formik.isSubmitting ? 'Verifying...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm font-semibold text-[#5c2a2a]">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-[#b78b61] hover:text-[#4f1f1f] hover:underline transition-colors">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login