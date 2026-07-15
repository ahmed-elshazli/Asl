import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, UploadCloud, Loader2, FileText, ShieldCheck, Info, Phone } from 'lucide-react';
import { useAllPaymentMethods } from '../../doctorDashBoard/hooks/usePaymentMethods';
import { useCreateSubscriptionByPatient } from '../../doctorDashBoard/hooks/useSubscriptions';
import { compressImage } from '../../lib/imageCompression';
import { toast } from 'sonner';

interface CheckoutModalProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CheckoutModal({ plan, isOpen, onClose, onConfirm }: CheckoutModalProps) {
  const { data: paymentMethodsData, isLoading } = useAllPaymentMethods();
  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData : ([] as any[]);

  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [senderNumber, setSenderNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const { mutate: createSubscription, isPending: isSubmitting } = useCreateSubscriptionByPatient();

  const selectedMethod = paymentMethods.find((m: any) => m.id === selectedMethodId || m._id === selectedMethodId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !receiptFile || !senderNumber.trim()) return;

    try {
      setIsCompressing(true);
      const compressedImage = await compressImage(receiptFile, 800, 0.6);
      setIsCompressing(false);

      createSubscription(
        {
          planId: plan._id || plan.id,
          paymentMethodId: selectedMethodId,
          senderNumber: senderNumber.trim(),
          paymentScreenshot: compressedImage,
        },
      {
        onSuccess: () => {
          toast.success('تم إرسال طلب الاشتراك بنجاح! سيتم مراجعته من قبل الطبيب.');
          // Reset form
          setSelectedMethodId('');
          setSenderNumber('');
          setReceiptFile(null);
          onConfirm();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message;
          const errorMsg = typeof msg === 'string' ? msg : Array.isArray(msg) ? msg[0] : 'حدث خطأ أثناء الاشتراك. حاول مجدداً.';
          toast.error(errorMsg);
        },
      }
    );
    } catch (error) {
      setIsCompressing(false);
      toast.error('حدث خطأ أثناء معالجة الصورة');
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">إتمام الاشتراك</h2>
                <p className="text-sm text-muted-foreground mt-1">اختر طريقة الدفع وأرفق الإيصال</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-primary to-accent text-white p-6 rounded-2xl mb-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-lg font-bold opacity-90 mb-2">ملخص الطلب</h3>
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className="text-3xl font-bold mb-1">{plan.name}</div>
                  <div className="text-sm opacity-80">اشتراك {plan.billingCycle === 'yearly' ? 'سنوي' : plan.billingCycle === 'monthly' ? 'شهري' : plan.billingCycle}</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">{plan.price}</div>
                  <div className="text-sm opacity-80">{plan.currency || 'EGP'}</div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center p-8 bg-secondary rounded-2xl border-2 border-dashed border-border text-muted-foreground">
                لا توجد طرق دفع متاحة حالياً. يرجى المحاولة لاحقاً.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Payment Methods Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-foreground mb-4">اختر وسيلة الدفع</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((method: any) => (
                      <label
                        key={method.id || method._id}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedMethodId === (method.id || method._id)
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id || method._id}
                          checked={selectedMethodId === (method.id || method._id)}
                          onChange={(e) => setSelectedMethodId(e.target.value)}
                          className="absolute opacity-0 w-0 h-0"
                        />
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedMethodId === (method.id || method._id) ? 'border-primary' : 'border-muted'
                          }`}>
                            {selectedMethodId === (method.id || method._id) && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <span className="font-bold text-foreground">{method.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Selected Method Details */}
                <AnimatePresence mode="wait">
                  {selectedMethod && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-secondary rounded-2xl p-6 border border-border space-y-6 mt-4">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                          <div>
                            <h4 className="font-bold text-foreground mb-1">بيانات التحويل</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              يرجى تحويل المبلغ الموضح أعلاه إلى الحساب التالي، ثم إرفاق صورة التحويل (الإيصال) بالأسفل لتأكيد الاشتراك.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-border/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">اسم الحساب</div>
                              <div className="font-bold">{selectedMethod.accountName}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">رقم الحساب / المحفظة</div>
                              <div className="font-bold text-primary font-mono select-all" dir="ltr">{selectedMethod.accountNumber}</div>
                            </div>
                          </div>
                        </div>

                        {selectedMethod.instructions && (
                          <div className="flex items-start gap-2 text-sm bg-orange-50 text-orange-800 p-3 rounded-lg border border-orange-100">
                            <Info className="w-5 h-5 shrink-0" />
                            <p>{selectedMethod.instructions}</p>
                          </div>
                        )}

                        {/* Sender Number Input */}
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-2">رقم الهاتف المرسل منه</label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="tel"
                              required
                              placeholder="01xxxxxxxxx"
                              value={senderNumber}
                              onChange={(e) => setSenderNumber(e.target.value)}
                              className="w-full pr-10 pl-4 py-3 bg-white rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary text-sm"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        {/* Receipt Upload */}
                        <div>
                          <label className="block text-sm font-bold text-foreground mb-3">إرفاق إيصال التحويل <span className="text-red-500">*</span></label>
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-white/50 hover:border-primary transition-all bg-white group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {receiptFile ? (
                                <>
                                  <FileText className="w-8 h-8 text-primary mb-2" />
                                  <p className="text-sm font-medium text-foreground">{receiptFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">اضغط لتغيير الملف</p>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                                  <p className="text-sm font-medium text-foreground mb-1">اضغط لاختيار صورة الإيصال</p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG حتى 5MB</p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setReceiptFile(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedMethod || isSubmitting || isCompressing || !receiptFile || !senderNumber.trim()}
                    className="px-8 py-3 bg-gradient-to-br from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {(isSubmitting || isCompressing) ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأكيد الدفع والاشتراك'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
