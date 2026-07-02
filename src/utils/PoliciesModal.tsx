import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import '../landing/policies.css';
import { useAboutUs } from '../doctorDashBoard/hooks/useAboutUs';

interface PoliciesModalProps {
  onClose: () => void;
  onAgree: () => void;
}

export function PoliciesModal({ onClose, onAgree }: PoliciesModalProps) {
  const { data: aboutUs } = useAboutUs();
  
  const mainEmail = aboutUs?.email || 'support@asl-health.com';
  const privacyEmail = 'privacy@asl-health.com';
  const refundsEmail = 'refunds@asl-health.com';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden policies-page"
      >
        {/* Header inside modal */}
        <div className="bg-gradient-to-br from-[#0F6E56] to-[#1D9E75] p-5 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">السياسات والشروط</h2>
            <p className="text-sm opacity-90">يُرجى قراءة والموافقة على الشروط قبل المتابعة</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 relative bg-white" style={{ direction: 'rtl' }}>
          {/* TOP BANNER */}
          <div className="top-banner">
            منصة أصِل للصحة والتغذية — جميع الخدمات رقمية &nbsp;|&nbsp; Asl Health & Nutrition Platform — All services are digital
          </div>

          <main style={{ padding: '32px 24px', margin: '0 auto', maxWidth: '800px' }}>
            {/* DELIVERY POLICY */}
            <section className="policy-section" id="delivery">
              <div className="section-header">
                <div className="section-icon">🚚</div>
                <div>
                  <h2>سياسة التوصيل والتسليم</h2>
                  <div className="en-title">Delivery & Service Activation Policy</div>
                </div>
              </div>
              <div className="policy-block">
                <h3>طبيعة الخدمة</h3>
                <p>
                  منصة <strong>أصِل</strong> هي منصة رقمية متخصصة في الصحة والتغذية. جميع خدماتنا تُقدَّم إلكترونياً عبر الإنترنت ولا تتضمن أي شحن أو توصيل مادي لمنتجات ملموسة.
                </p>
              </div>
              <div className="highlight-box green">
                <strong>✅ تسليم فوري — لا انتظار</strong>
                يتم تفعيل اشتراكك تلقائياً فور اكتمال عملية الدفع بنجاح، وتحصل على وصول فوري لجميع ميزات الخطة المدفوعة.
              </div>
              <div className="policy-block">
                <h3>آلية التسليم الرقمي</h3>
                <ul>
                  <li>يتم تفعيل الخدمة فور استلام تأكيد الدفع (عادةً في أقل من 60 ثانية).</li>
                  <li>ستصلك رسالة تأكيد على بريدك الإلكتروني المسجل تتضمن تفاصيل اشتراكك.</li>
                  <li>يمكنك الوصول إلى خدماتك مباشرةً من خلال تسجيل الدخول إلى حسابك في المنصة.</li>
                  <li>الخدمة متاحة على مدار الساعة، طوال أيام الأسبوع (24/7)، من أي جهاز ومن أي مكان.</li>
                </ul>
              </div>
            </section>

            {/* REFUND POLICY */}
            <section className="policy-section" id="refund">
              <div className="section-header">
                <div className="section-icon">↩️</div>
                <div>
                  <h2>سياسة الإلغاء والاسترداد</h2>
                  <div className="en-title">Cancellation & Refund Policy</div>
                </div>
              </div>
              <div className="highlight-box amber">
                <strong>⚠️ خدمة رقمية — يُرجى قراءة هذه السياسة بعناية</strong>
                نظراً لأن خدماتنا رقمية وتُفعَّل فورياً، تُطبَّق شروط استرداد خاصة.
              </div>
              <div className="policy-block">
                <h3>حق الاسترداد الكامل</h3>
                <ul>
                  <li><strong>خلال 7 أيام</strong> من تاريخ الاشتراك الأول، إذا لم تستخدم الخدمة بشكل جوهري.</li>
                  <li>في حالة حدوث خطأ تقني من جانبنا أدى إلى عدم تفعيل الخدمة أو تفعيلها بشكل غير صحيح.</li>
                  <li>في حالة الدفع المزدوج أو الخطأ في المبلغ المُحتسَب.</li>
                </ul>
              </div>
              <div className="policy-block">
                <h3>حالات لا يتم فيها الاسترداد</h3>
                <ul>
                  <li>مرور أكثر من 30 يوماً على تاريخ الاشتراك.</li>
                  <li>الاشتراكات التجريبية المجانية.</li>
                  <li>خرق شروط الاستخدام.</li>
                </ul>
              </div>
            </section>

            {/* PRIVACY POLICY */}
            <section className="policy-section" id="privacy">
              <div className="section-header">
                <div className="section-icon">🔒</div>
                <div>
                  <h2>سياسة الخصوصية وحماية البيانات</h2>
                  <div className="en-title">Privacy Policy & Data Protection</div>
                </div>
              </div>
              <div className="policy-block">
                <h3>ما البيانات التي نجمعها؟</h3>
                <ul>
                  <li><strong>بيانات الهوية:</strong> الاسم الكامل، عنوان البريد الإلكتروني، رقم الهاتف، الدولة.</li>
                  <li><strong>البيانات الصحية:</strong> الوزن، الطول، العمر، الجنس — لتقديم خطط تغذية وتدريب مخصصة.</li>
                  <li><strong>البيانات الاستخدام:</strong> تاريخ الدخول، التفاعل مع المحتوى، التقدم في البرامج.</li>
                </ul>
              </div>
              <div className="highlight-box green">
                <strong>🔐 البيانات الصحية — حماية خاصة</strong>
                نتعامل مع بياناتك الصحية بأعلى مستويات الحماية. لا يمكن الوصول إليها إلا من قِبلك أنت والمختصين الصحيين الذين تخوّلهم صراحةً داخل المنصة.
              </div>
            </section>

            {/* CONTACT */}
            <section className="policy-section" id="contact" style={{ marginBottom: 0 }}>
              <div className="section-header">
                <div className="section-icon">✉️</div>
                <div>
                  <h2>تواصل معنا</h2>
                  <div className="en-title">Contact Us</div>
                </div>
              </div>
              <div className="contact-grid">
                <div className="contact-card">
                  <div className="cc-icon">📧</div>
                  <div>
                    <div className="cc-label">الدعم الفني</div>
                    <div className="cc-value"><a href={`mailto:${mainEmail}`}>{mainEmail}</a></div>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon">🔒</div>
                  <div>
                    <div className="cc-label">الخصوصية</div>
                    <div className="cc-value"><a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></div>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="cc-icon">↩️</div>
                  <div>
                    <div className="cc-label">الاسترداد</div>
                    <div className="cc-value"><a href={`mailto:${refundsEmail}`}>{refundsEmail}</a></div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 p-5 flex items-center justify-end gap-3 flex-shrink-0" style={{ direction: 'rtl' }}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onAgree}
            className="px-6 py-2.5 rounded-xl bg-[#0F6E56] text-white font-bold flex items-center gap-2 hover:bg-[#1D9E75] transition-colors shadow-lg"
          >
            <Check className="w-5 h-5" />
            أوافق على الشروط والسياسات
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
