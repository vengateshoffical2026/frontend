import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createDonationOrderAPI, verifyDonationPaymentAPI } from '../api/controllers/donationPayment';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function formatAmount(amount?: number) {
  if (!amount) return '';
  return '₹' + (amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 });
}

const PROJECTS = [
  'Library Renovation',
  'Scholarship Fund',
  'Community Outreach',
];
const RAZORPAY_KEY = 'rzp_live_Sb68Fpl6DjTErC';
// const TARGET_AMOUNT = 10000000; // ₹1,00,000 in paise
// const CURRENT_AMOUNT = 3200000; // Example: ₹32,000 in paise

const Donation: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number | undefined>();
  const [selectedProject, setSelectedProject] = useState<string>(PROJECTS[0]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreatingDonation, setIsCreatingDonation] = useState(false);
  const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleDonation = async () => {
    setIsCreatingDonation(true)
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
       const order = await createDonationOrderAPI(payload)
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
             await verifyDonationPaymentAPI({
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_order_id: response.razorpay_order_id,
               razorpay_signature: response.razorpay_signature
             })
             toast.success('Thank you for your donation!')
             queryClient.invalidateQueries({ queryKey: ['donationList'] })
             setIsCreatingDonation(false)
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

  // Progress bar calculation
//   const progress = Math.min(100, Math.round(((CURRENT_AMOUNT + (donationAmount || 0)) / TARGET_AMOUNT) * 100));

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-12 px-2 sm:px-0">
      {/* Animated background SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f4ecd8" fillOpacity="1" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
      </svg>
      <div className="relative z-10 w-full max-w-xl">
        <div className="group rounded-3xl bg-beige/90 p-8 shadow-[0_8px_32px_rgba(61,37,22,0.13)] backdrop-blur-xl border border-white/30 flex flex-col transition-all duration-300 hover:bg-beige/95 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(61,37,22,0.18)] ring-1 ring-white/20">
          <h1 className="text-2xl font-serif font-black text-primary mb-2 tracking-tight">Support a Project</h1>
          <p className="mb-6 text-body/80 text-base font-serif italic">“Your generosity helps us preserve heritage and empower communities.”</p>

          {/* Progress bar */}
          {/* <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-muted">Raised: {formatAmount(CURRENT_AMOUNT + (donationAmount || 0))}</span>
              <span className="text-xs font-bold text-muted">Goal: {formatAmount(TARGET_AMOUNT)}</span>
            </div>
            <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-2xs text-accent font-bold mt-1">{progress}% funded</div>
          </div> */}

          <div className="flex flex-col gap-4 mb-6">
            <label className="text-sm font-bold text-body block">Select Project</label>
            <select
              className="w-full rounded-xl border border-white/40 bg-white/70 text-body px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 font-bold shadow-inner"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              {PROJECTS.map((proj) => (
                <option key={proj} value={proj}>{proj}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 mb-8 flex flex-col justify-center">
            <label className="text-sm font-bold text-body block mb-3">
              Donation Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-bold">₹</span>
              <input
                type="number"
                min="1"
                placeholder="500"
                className="w-full pl-8 pr-4 py-3.5 rounded-xl border border-white/40 bg-white/80 text-body placeholder:text-[#8a7f6a] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all font-bold shadow-inner"
                onChange={(e) => {
                  const rupees = parseFloat(e.target.value);
                  setDonationAmount(isNaN(rupees) ? undefined : Math.round(rupees * 100));
                }}
                value={donationAmount ? donationAmount / 100 : ''}
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
            className={`w-full rounded-xl border-2 border-primary bg-gradient-to-r from-primary to-accent py-3.5 text-base font-bold text-white shadow-lg transition-all hover:from-accent hover:to-primary hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 ${isCreatingDonation ? 'cursor-not-allowed opacity-70' : ''}`}
            onClick={handleDonation}
            disabled={isCreatingDonation}
          >
            {isCreatingDonation ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                Processing...
              </span>
            ) : 'Support Project'}
          </button>

          {/* Impact/testimonial */}
          <div className="mt-8 bg-white/60 rounded-xl p-4 text-center shadow-inner border border-primary/10">
            <p className="text-sm text-body italic font-serif">“Last year, over 500 students benefited from your donations. Together, we make a difference!”</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
