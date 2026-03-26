import { useState } from 'react'
import { useCreateOrder, useVerifyPayment } from '../api/hooks/subscriptionPaymentQuery'
import { toast } from 'react-toastify'
import { useCreateDonationOrder, useVerifyDonationPayment } from '../api/hooks/donationQuery'

declare global {
  interface Window {
    Razorpay: any
  }
}

const Pricing = () => {
  const [selectedProject] = useState('Chola Temple Inscription')
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = useCreateOrder()
  const { mutateAsync: verifyPaymentMutation } = useVerifyPayment();
  const { mutateAsync: createDonationOrder } = useCreateDonationOrder();
  const { mutateAsync: verifyDonationPayment } = useVerifyDonationPayment();
  const [donationAmount, setDonationAmount] = useState<number | undefined>(undefined);

  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) return JSON.parse(userData)
    } catch {}
    return null
  }
  const user = getUserData()
  const isSubscribed = user?.isSubscribed || false

  const handleUpgradeClick = async () => {
    let payload: any = {
      amount: 100,
      currency: 'INR',
      receipt: 'receipt_' + Date.now().toString()
    }
    try {
      const order = await createOrderMutation(payload)

      const options = {
        key: 'rzp_live_SGteQC3JSxjhtP', // Replace with actual key
        amount: order?.data?.order?.amount ?? 300000,
        currency: order?.data?.order?.currency ?? 'INR',
        order_id: order?.data?.order?.id || null,
        name: 'Sasanam',
        description: 'Upgrade to Contributor',
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            toast.success('Payment successful!')
            // Always try to verify, even if signature is missing
            try {
              const verificationPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_signature: response.razorpay_signature || null
              }
              const res = await verifyPaymentMutation(verificationPayload)
              console.log('✅ Verification response:', res)
              localStorage.setItem('user', JSON.stringify(res?.data?.user))
              if (response.razorpay_signature) {
                toast.success('Payment verified successfully!')
              } else {
                toast.warning('Payment completed but signature missing - manual verification may be needed')
              }
            } catch (err) {
              console.error('❌ Verification error:', err)
              toast.error('Payment verification failed - please contact support')
            }
          } else {
            toast.error('Payment failed')
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#8B4513', // vintage accent
        },
      }
      console.log('🚀 Initializing Razorpay with options:', options)
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error('Failed to create order')
    }
  }

  const handleDonation = async () => {
    if (!donationAmount || donationAmount <= 0) {
      toast.error('Please enter a valid donation amount')
      return;
    }
    let payload: any = {
      amount: donationAmount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now().toString()
    }
    try {
      const order = await createDonationOrder(payload)
      console.log('🚀 Donation order created:', order?.data?.order)
      const options = {
        key: 'rzp_live_SGteQC3JSxjhtP',
        amount: order?.data?.order?.amount ?? donationAmount,
        currency: order?.data?.order?.currency ?? 'INR',
        order_id: order?.data?.order?.id || null,
        name: 'Sasanam',
        description: `Donation for ${selectedProject}`,
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            toast.success('Donation successful!')
            try {
              const verificationPayload = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || null,
                razorpay_signature: response.razorpay_signature || null
              }
              const res = await verifyDonationPayment(verificationPayload)
              console.log('✅ Donation verification response:', res)
              if (response.razorpay_signature) {
                toast.success('Donation verified successfully!')
              } else {
                toast.warning('Donation completed but signature missing - manual verification may be needed')
              }
            } catch (err) {
              console.error('❌ Donation verification error:', err)
              toast.error('Donation verification failed - please contact support')
            }
          } else {
            toast.error('Donation failed')
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#8B4513',
        },
      }
      console.log('🚀 Initializing Razorpay with options:', options)
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('❌ Donation order creation failed:', error)
      toast.error('Failed to create donation order')
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-sans text-[#4A3B32]  flex flex-col" >
      <div className="fixed inset-0 z-0 bg-[#FFFFFF]/70 backdrop-blur-[2px]"></div>
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 sm:px-6 lg:px-8">
        

        {/* Hero Section */}
        <section className="mt-12 text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4A3B32] mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B4513] to-[#a78e7e]">Plan</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#6A5A4A] max-w-2xl mx-auto font-medium">
            Unlock exclusive tools and resources to accelerate your historical research.
          </p>
        </section>

        {/* Pricing Cards - using Grid */}
        <section className="mt-16 mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 items-stretch">
          
          {/* Card 1: Free Explorer */}
          <div className="group rounded-3xl bg-[#F5F5DC]/80 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] backdrop-blur-xl border border-white/30 flex flex-col transition-all duration-300 hover:bg-[#F5F5DC]/90 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] ring-1 ring-white/20">
            <h3 className="text-2xl font-bold text-[#4A3B32] mb-2">Free Explorer</h3>
            <p className="text-3xl font-black text-[#8B4513] mb-8 drop-shadow-sm">Free</p>
            
            <ul className="flex-1 space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-[#8B4513] font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-[#4A3B32] font-semibold">Basic Archive Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B4513] font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-[#4A3B32] font-semibold">Read Issues from the Journal</span>
              </li>
            </ul>

            <button 
              className="w-full rounded-xl bg-[#EEDDCC] py-3.5 text-sm font-bold text-[#6A5A4A] transition cursor-default border border-white/20 shadow-inner"
              disabled
            >
              {!isSubscribed ? 'Current Plan' : 'Free Tier'}
            </button>
          </div>

          {/* Card 2: Contribute Once */}
          <div className="relative group rounded-3xl bg-[#FFFFFF]/90 p-8 shadow-[0_12px_40px_rgba(61,37,22,0.15)] backdrop-blur-xl border-2 border-[#8B4513] flex flex-col transition-all duration-300 hover:-translate-y-2 lg:-mt-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8B4513] to-[#a78e7e] px-4 py-1.5 text-xs font-black tracking-widest text-[#FFFFFF] uppercase shadow-lg">Recommended</div>
            <h3 className="text-2xl font-bold text-[#4A3B32] mb-2">Contribute Once</h3>
            <p className="text-3xl font-black text-[#8B4513] mb-8 flex items-baseline gap-1 drop-shadow-sm">
              ₹3000<span className="text-sm font-bold text-[#a78e7e]">/3 years</span>
            </p>
            
            <ul className="flex-1 space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-[#8B4513] font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-[#4A3B32] font-bold">Full Archive Access</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#8B4513] font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-[#4A3B32] font-bold">Download Soft &amp; Hard Copies</span>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-[#8B4513] font-bold text-lg leading-none mt-1">✓</span>
                <span className="text-sm text-[#4A3B32] font-bold">Priority Early Access</span>
              </li>
            </ul>

            <button 
              className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all ${
                isSubscribed 
                  ? 'bg-[#6A5A4A] cursor-not-allowed opacity-80' 
                  : 'bg-[#8B4513] hover:bg-[#256a5e] hover:shadow-xl'
              } ${isCreatingOrder && !isSubscribed ? 'cursor-not-allowed opacity-70' : ''}`}
              onClick={handleUpgradeClick}
              disabled={isCreatingOrder || isSubscribed}
            >
              {isSubscribed ? 'Current Plan' : (isCreatingOrder ? 'Creating Order...' : 'Upgrade Now')}
            </button>
          </div>

          {/* Card 3: Fund a Specific Project */}
          <div className="group rounded-3xl bg-[#F5F5DC]/80 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.1)] backdrop-blur-xl border border-white/30 flex flex-col transition-all duration-300 hover:bg-[#F5F5DC]/90 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.15)] ring-1 ring-white/20">
            <h3 className="text-xl font-bold text-[#4A3B32] mb-6">Fund a Specific Project</h3>
            
            <div className="flex-1 mb-10 flex flex-col justify-center">
              <label className="text-sm font-bold text-[#4A3B32] block mb-3">
                Donation Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a78e7e] font-bold">₹</span>
                <input 
                  type="number"
                  min="1"
                  placeholder="45000"
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-white/40 bg-white/50 text-[#4A3B32] placeholder:text-[#8a7f6a] focus:outline-none focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/50 transition-all font-bold shadow-inner"
                  onChange={(e) => {
                    const rupees = parseFloat(e.target.value)
                    setDonationAmount(isNaN(rupees) ? undefined : Math.round(rupees * 100))
                  }}
                />
              </div>
              <p className="text-xs text-[#a78e7e] mt-3 font-bold flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Target: ₹1,00,000 for {selectedProject}
              </p>
            </div>

            <button 
              className="w-full rounded-xl border-2 border-[#8B4513] bg-transparent py-3.5 text-sm font-bold text-[#8B4513] transition-all hover:bg-[#8B4513] hover:text-[#FFFFFF] hover:shadow-lg"
              onClick={()=>{handleDonation()}}
            >
              Support Project
            </button>
          </div>
        </section>

        
        
      </div>
    </main>
  )
}

export default Pricing
