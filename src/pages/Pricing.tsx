import { useState } from 'react'
import Header from '../components/Header'
import { useCreateOrder, useVerifyPayment } from '../api/hooks/paymentQuery'
import { toast } from 'react-toastify'

declare global {
  interface Window {
    Razorpay: any
  }
}

const Pricing = () => {
  const [selectedProject, setSelectedProject] = useState('Chola Temple Inscription')
  const { mutateAsync: createOrderMutation, isPending: isCreatingOrder } = useCreateOrder()
  const { mutateAsync: verifyPaymentMutation, isPending: isVerifyingPayment } = useVerifyPayment()
  const handleUpgradeClick = async () => {
    let payload:any = {
      amount: 300,
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
          color: '#2e8578',
        },
      }
      console.log('🚀 Initializing Razorpay with options:', options)
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error('Failed to create order')
    }
  }

  return (
    <main className="min-h-screen bg-[#e4d3be] bg-cover bg-center" style={{ backgroundImage: 'url(/homebg.png)' }}>
      <div className="min-h-screen bg-[#f1e4d7]/75">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-5 pb-0 pt-2 sm:px-6 lg:px-7">
          <div className="p-5">
            <Header />
          </div>

          {/* Hero Section */}
          <section className="mt-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4f1f1f] mb-2 lg:mb-3">
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#5c2a2a] max-w-2xl mx-auto">
              Unlock Exclusive Tools and resources to accelerate your historical Research
            </p>
          </section>

          {/* Pricing Cards */}
          <section className="mt-12 mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-center">
            
            {/* Card 1: Free Explorer */}
            <div className="rounded-2xl bg-[#ddd6c4]/95 p-6 sm:p-8 shadow-lg w-full lg:w-80 flex flex-col">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#4f1f1f] mb-2">Free Explorer</h3>
              <p className="text-2xl sm:text-3xl font-bold text-[#2e8578] mb-6">Free</p>
              
              <ul className="flex-1 space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#2e8578] font-bold text-xl leading-none mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[#5c2a2a]">Basic Archive Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#2e8578] font-bold text-xl leading-none mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[#5c2a2a]">Can See Issues from the Journal</span>
                </li>
              </ul>

              <button className="w-full rounded-lg bg-[#2e8578] py-3 text-base sm:text-lg font-semibold text-white hover:bg-[#256a5e] transition">
                Current Plan
              </button>
            </div>

            {/* Card 2: Contribute Once */}
            <div className="rounded-2xl bg-[#ddd6c4]/95 p-6 sm:p-8 shadow-lg w-full lg:w-80 flex flex-col">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#4f1f1f] mb-2">Contribute Once</h3>
              <p className="text-2xl sm:text-3xl font-bold text-[#2e8578] mb-6">₹3000/3years</p>
              
              <ul className="flex-1 space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#2e8578] font-bold text-xl leading-none mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[#5c2a2a]">Archive Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#2e8578] font-bold text-xl leading-none mt-0.5">✓</span>
                  <span className="text-sm sm:text-base text-[#5c2a2a]">Download Soft copy & Hard copy</span>
                </li>
              </ul>

              <button 
                className={`w-full rounded-lg bg-[#2e8578] py-3 text-base sm:text-lg font-semibold text-white hover:bg-[#256a5e] transition ${isCreatingOrder ? 'cursor-not-allowed opacity-70' : ''}`}
                onClick={handleUpgradeClick}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? 'Creating Order...' : 'Upgrade Now'}
              </button>
            </div>

            {/* Card 3: Fund a Specific Projects */}
            <div className="rounded-2xl bg-[#ddd6c4]/95 p-6 sm:p-8 shadow-lg w-full lg:w-80 flex flex-col">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#4f1f1f] mb-6">Fund a Specific Projects</h3>
              
              <div className="flex-1 space-y-4 mb-8">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-[#5c2a2a] block mb-2">
                    Select the Project
                  </label>
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#b8a88a] bg-white text-sm text-[#5c2a2a] focus:outline-none focus:ring-2 focus:ring-[#2e8578]"
                  >
                    <option>Chola Temple Inscription</option>
                    <option>Pallava Script Study</option>
                    <option>Ancient Manuscripts</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-[#5c2a2a] block mb-2">
                    Funding Amount
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="₹45000"
                      className="flex-1 px-3 py-2 rounded-lg border border-[#b8a88a] bg-white text-sm text-[#5c2a2a] placeholder:text-[#9f8d79] focus:outline-none focus:ring-2 focus:ring-[#2e8578]"
                    />
                    <span className="px-3 py-2 bg-[#e8dcc4] text-[#2e8578] rounded-lg text-xs sm:text-sm font-semibold">
                      Goan
                    </span>
                  </div>
                  <p className="text-xs text-[#9f8d79] mt-1">₹45000/100000</p>
                </div>
              </div>

              <button className="w-full rounded-lg bg-[#2e8578] py-3 text-base sm:text-lg font-semibold text-white hover:bg-[#256a5e] transition">
                Support Project
              </button>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-4 rounded-t-xl bg-[#cfb793]/95 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-[#4f1f1f] sm:gap-x-8 sm:text-sm lg:gap-x-12 lg:text-base">
            <span className="cursor-pointer hover:underline">Contact Us</span>
            <span className="cursor-pointer hover:underline">Terms of service</span>
            <span className="cursor-pointer hover:underline">Privacy &amp; Policy</span>
            <span className="cursor-pointer hover:underline">About</span>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default Pricing
