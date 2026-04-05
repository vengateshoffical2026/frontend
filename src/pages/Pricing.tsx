import { useState } from 'react'
import { useCreateOrder, useVerifyPayment } from '../api/hooks/subscriptionPaymentQuery'
import { toast } from 'react-toastify'
import { useCreateDonationOrder, useVerifyDonationPayment, useDonationList } from '../api/hooks/donationQuery'
import { useQueryClient } from '@tanstack/react-query'
import PageSEO from '../components/PageSEO'
import { useNavigate } from 'react-router-dom'

declare global {
  interface Window {
    Razorpay: any
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_SGteQC3JSxjhtP'

const Pricing = () => {
  const [selectedProject] = useState('Chola Temple Inscription')
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = useCreateOrder()
  const { mutateAsync: verifyPaymentMutation } = useVerifyPayment()
  const { mutateAsync: createDonationOrder, isPending: isCreatingDonation } = useCreateDonationOrder()
  const { mutateAsync: verifyDonationPayment } = useVerifyDonationPayment()
  const [donationAmount, setDonationAmount] = useState<number | undefined>(undefined)
  const [donationPage, setDonationPage] = useState(1)
  const { data: donationListData, isLoading: isDonationListLoading } = useDonationList(donationPage, 10)
  const [hideState] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) return JSON.parse(userData)
    } catch {}
    return null
  }
  const user = getUserData()
  const token = localStorage.getItem('token')
  const isAdmin = ['admin', 'super_admin'].includes(user?.role)
  const [isSubscribed, setIsSubscribed] = useState(user?.isSubscribed || isAdmin || false)

  const handleUpgradeClick = async () => {
    if (!token || !user) {
      toast.error('Please log in to subscribe')
      navigate('/login')
      return
    }

    const payload = {
      amount: 300000,
      currency: 'INR',
      receipt: 'rcpt_' + Date.now().toString()
    }
    try {
      const order = await createOrderMutation(payload)
      const orderData = order?.data?.order

      if (!orderData?.id) {
        toast.error('Failed to create order - please try again')
        return
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.id,
        name: 'Sasanam',
        description: 'Contributor Plan - 3 Year Access',
        handler: async function (response: any) {
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            toast.error('Payment incomplete - please contact support')
            return
          }
          try {
            const res = await verifyPaymentMutation({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })

            if (res?.data?.user) {
              localStorage.setItem('user', JSON.stringify(res.data.user))
              setIsSubscribed(true)
              toast.success('Subscription activated successfully!')
            } else {
              toast.warning('Payment processed but user update failed - please refresh')
            }
          } catch (err) {
            console.error('Verification error:', err)
            toast.error('Payment verification failed - please contact support')
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B4513',
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled')
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        toast.error(response.error?.description || 'Payment failed - please try again')
      })
      rzp.open()
    } catch (error) {
      console.error('Create order error:', error)
      toast.error('Failed to create order - please try again')
    }
  }

  const handleDonation = async () => {
    if (!token || !user) {
      toast.error('Please log in to donate')
      navigate('/login')
      return
    }
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount')
      return
    }
    const payload = {
      amount: donationAmount,
      currency: 'INR',
      receipt: 'don_' + Date.now().toString()
    }
    try {
      const order = await createDonationOrder(payload)
      const orderData = order?.data?.order

      if (!orderData?.id) {
        toast.error('Failed to create donation order - please try again')
        return
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.id,
        name: 'Sasanam',
        description: `Donation for ${selectedProject}`,
        handler: async function (response: any) {
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            toast.error('Payment incomplete - please contact support')
            return
          }
          try {
            await verifyDonationPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
            toast.success('Thank you for your donation!')
            queryClient.invalidateQueries({ queryKey: ['donationList'] })
          } catch (err) {
            console.error('Donation verification error:', err)
            toast.error('Donation verification failed - please contact support')
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#8B4513',
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled')
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        console.error('Donation payment failed:', response.error)
        toast.error(response.error?.description || 'Payment failed - please try again')
      })
      rzp.open()
    } catch (error) {
      console.error('Donation order creation failed:', error)
      toast.error('Failed to create donation order')
    }
  }

  const formatAmount = (paise: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(paise / 100)
  }

  const donations = donationListData?.data?.donations || []
  const totalDonations = donationListData?.data?.total || 0
  const totalPages = Math.ceil(totalDonations / 10)

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans text-body  flex flex-col" >
      <PageSEO
        title="Subscribe & Donate"
        description="Support Sasanam's mission to preserve ancient inscriptions. Subscribe to access the full archive or make a donation to help digitize South Indian heritage."
        path="/pricing"
      />
      <div className="fixed inset-0 z-0 bg-[#FFFFFF]/70 backdrop-blur-[2px]"></div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">


        {/* Hero Section */}
        <section className="mt-12 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-body mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Plan</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted max-w-2xl mx-auto font-medium">
            Unlock exclusive tools and resources to accelerate your historical research.
          </p>
        </section>

        {/* Pricing Cards - using Grid */}
        <section className="mt-16 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 items-stretch">

          {/* Card 1: Free Explorer */}
          <div className="group rounded-3xl bg-beige/80 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] backdrop-blur-xl border border-white/30 flex flex-col transition-all duration-300 hover:bg-beige/90 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] ring-1 ring-white/20">
            <h3 className="text-2xl font-bold text-body mb-2">Free Explorer</h3>
            <p className="text-3xl font-black text-primary mb-8 drop-shadow-sm">Free</p>

            <ul className="flex-1 space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-body font-semibold">Basic Archive Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-body font-semibold">Read Issues from the Journal</span>
              </li>
            </ul>

            <button
              className="w-full rounded-xl bg-border py-3.5 text-sm font-bold text-muted transition cursor-default border border-white/20 shadow-inner"
              disabled
            >
              {!isSubscribed ? 'Current Plan' : 'Free Tier'}
            </button>
          </div>

          {/* Card 2: Contribute Once */}
          <div className="relative group rounded-3xl bg-[#FFFFFF]/90 p-8 shadow-[0_12px_40px_rgba(61,37,22,0.15)] backdrop-blur-xl border-2 border-primary flex flex-col transition-all duration-300 hover:-translate-y-2 lg:-mt-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-black tracking-widest text-[#FFFFFF] uppercase shadow-lg">Recommended</div>
            <h3 className="text-2xl font-bold text-body mb-2">Contribute Once</h3>
            <p className="text-3xl font-black text-primary mb-8 flex items-baseline gap-1 drop-shadow-sm">
              ₹3000<span className="text-sm font-bold text-accent">/3 years</span>
            </p>

            <ul className="flex-1 space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-body font-bold">Full Archive Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-body font-bold">Download Soft &amp; Hard Copies</span>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-body font-bold">Priority Early Access</span>
              </li>
            </ul>

            <button
              className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all ${
                isSubscribed
                  ? 'bg-muted cursor-not-allowed opacity-80'
                  : 'bg-primary hover:bg-[#256a5e] hover:shadow-xl'
              } ${isCreatingOrder && !isSubscribed ? 'cursor-not-allowed opacity-70' : ''}`}
              onClick={handleUpgradeClick}
              disabled={isCreatingOrder || isSubscribed}
            >
              {isSubscribed ? 'Current Plan' : (isCreatingOrder ? 'Creating Order...' : 'Upgrade Now')}
            </button>
          </div>

          {/* Card 3: Fund a Specific Project */}
            <div className="group rounded-3xl bg-beige/80 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] backdrop-blur-xl border border-white/30 flex flex-col transition-all duration-300 hover:bg-beige/90 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] ring-1 ring-white/20">
            <h3 className="text-xl font-bold text-body mb-6">Fund a Specific Project</h3>

            <div className="flex-1 mb-10 flex flex-col justify-center">
              <label className="text-sm font-bold text-body block mb-3">
                Donation Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  placeholder="500"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-white/40 bg-white/50 text-body placeholder:text-[#8a7f6a] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all font-bold shadow-inner"
                  onChange={(e) => {
                    const rupees = parseFloat(e.target.value)
                    setDonationAmount(isNaN(rupees) ? undefined : Math.round(rupees * 100))
                  }}
                />
              </div>
              {donationAmount && donationAmount > 0 && (
                <p className="text-xs text-primary mt-2 font-bold">
                  You will donate {formatAmount(donationAmount)}
                </p>
              )}
              <p className="text-xs text-accent mt-2 font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Target: ₹1,00,000 for {selectedProject}
              </p>
            </div>

            <button
              className={`w-full rounded-xl border-2 border-primary bg-transparent py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-[#FFFFFF] hover:shadow-lg ${isCreatingDonation ? 'cursor-not-allowed opacity-70' : ''}`}
              onClick={handleDonation}
              disabled={isCreatingDonation}
            >
              {isCreatingDonation ? 'Processing...' : 'Support Project'}
            </button>
          </div>
        </section>

        {/* Donation List Section */}
        <section className="mb-20 px-4">
          <div className="rounded-3xl bg-[#FFFFFF]/90 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] backdrop-blur-xl border border-white/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-body mb-2 text-center">Our Generous Donors</h2>
            <p className="text-sm text-muted mb-8 text-center font-medium">
              Thank you to everyone who has contributed to preserving our heritage.
            </p>

            {isDonationListLoading ? (
              <div className="space-y-3 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 w-32 rounded bg-border/40" />
                    <div className="h-4 w-20 rounded bg-border/30" />
                    <div className="h-4 w-24 rounded bg-border/30 ml-auto" />
                  </div>
                ))}
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-8 text-accent font-semibold">
                No donations yet. Be the first to contribute!
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="py-3 px-4 text-xs font-bold text-primary uppercase tracking-wider">Donor</th>
                        <th className="py-3 px-4 text-xs font-bold text-primary uppercase tracking-wider">Amount</th>
                        <th className="py-3 px-4 text-xs font-bold text-primary uppercase tracking-wider hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation._id} className="border-b border-beige hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3 px-4 text-sm font-semibold text-body capitalize">{donation.donaterName}</td>
                          <td className="py-3 px-4 text-sm font-bold text-primary">{formatAmount(donation.donationAmount)}</td>
                          <td className="py-3 px-4 text-sm text-muted hidden sm:table-cell">
                            {new Date(donation.donationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-6">
                    <button
                      onClick={() => setDonationPage((p) => Math.max(1, p - 1))}
                      disabled={donationPage <= 1}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-primary border border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-semibold text-muted">
                      Page {donationPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setDonationPage((p) => Math.min(totalPages, p + 1))}
                      disabled={donationPage >= totalPages}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-primary border border-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

      </div>
    </main>
  )
}

export default Pricing
