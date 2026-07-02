import { motion, AnimatePresence } from 'motion/react';
import { Star, Loader2, MessageSquare, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useAllReviews, useToggleReviewPublish, useDeleteReview, useReviewStatistics } from '../../hooks/useReviews';

export function ReviewsSection() {
  const { data: reviews, isLoading } = useAllReviews();
  const { data: stats } = useReviewStatistics();
  const { mutate: togglePublish, isPending: toggling } = useToggleReviewPublish();
  const { mutate: deleteReview, isPending: deleting } = useDeleteReview();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold text-lg">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  const allReviews = reviews || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">تقييمات المستخدمين</h1>
          <p className="text-muted-foreground">إدارة التقييمات والآراء وتحديد ما يظهر في الصفحة الرئيسية</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">إجمالي التقييمات</p>
              <h3 className="text-2xl font-black">{stats.totalReviews || reviews?.length || 0}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">متوسط التقييم</p>
              <h3 className="text-2xl font-black">{stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}</h3>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">التقييمات المنشورة</p>
              <h3 className="text-2xl font-black">{stats.publishedReviews || reviews?.filter(r => r.isPublished)?.length || 0}</h3>
            </div>
          </div>
        </div>
      )}

      {allReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-primary/5 flex flex-col items-center">
          <MessageSquare className="w-16 h-16 text-secondary mb-4" />
          <h2 className="text-xl font-bold mb-2">لا توجد تقييمات بعد</h2>
          <p className="text-muted-foreground">لم يقم أي مستخدم بإضافة تقييم حتى الآن.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {allReviews.map((review) => {
              const rId = review._id || review.id;
              const isPublished = review.isPublished;
              const rUser = review.user;
              
              return (
                <motion.div
                  key={rId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-primary/5 hover:shadow-md transition-all relative flex flex-col"
                >
                  {/* Status Badge */}
                  <div className={`absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isPublished ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isPublished ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {isPublished ? 'منشور' : 'مخفي'}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                      {rUser?.images?.[0] ? (
                        <img src={rUser.images[0]} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        rUser?.fullName?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{rUser?.fullName || 'مستخدم غير معروف'}</h3>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (review.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 fill-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-secondary mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => rId && togglePublish(rId)}
                      disabled={toggling}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        isPublished
                          ? 'bg-secondary text-muted-foreground hover:bg-red-50 hover:text-red-600'
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {isPublished ? 'إخفاء التقييم' : 'نشر التقييم'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => rId && deleteReview(rId)}
                      disabled={deleting}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all disabled:opacity-50"
                      title="حذف نهائي"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
