import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Save, Trash2, Edit2, CheckCircle2, Loader2 } from 'lucide-react';
import { useMyReview, useCreateReview, useUpdateReview, useDeleteMyReview } from '../../users/hooks/usePatientReviews';
import ConfirmModal from '../../components/ConfirmModal';

export function PatientReviewCard() {
  const { data: myReview, isLoading } = useMyReview();
  const { mutate: createReview, isPending: isCreating } = useCreateReview();
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteMyReview();

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (myReview && !isEditing) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview, isEditing]);

  const handleSave = () => {
    if (!comment.trim()) {
      import('sonner').then(({ toast }) => toast.error('يرجى كتابة تعليق'));
      return;
    }
    
    if (myReview) {
      updateReview({ rating, comment }, { onSuccess: () => setIsEditing(false) });
    } else {
      createReview({ rating, comment }, { onSuccess: () => setIsEditing(false) });
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/10 flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // وضع العرض (View Mode)
  if (myReview && !isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/10 relative overflow-hidden"
      >
        {myReview.isPublished && (
          <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            منشور للعامة
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Star className="w-7 h-7 fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">تقييمك للموقع</h3>
            <p className="text-muted-foreground text-sm">شكراً لمشاركتك رأيك معنا</p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-6 mb-6">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < myReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed font-medium">"{myReview.comment}"</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditing(true)}
            className="flex-1 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            تعديل التقييم
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex items-center justify-center"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    );
  }

  // وضع التعديل / الإنشاء (Edit / Create Mode)
  const isPending = isCreating || isUpdating;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/10"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg">
          <MessageSquare className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{myReview ? 'تعديل تقييمك' : 'أضف تقييمك'}</h3>
          <p className="text-muted-foreground text-sm">شاركنا رأيك في تجربتك معنا</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-3">تقييمك</label>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="focus:outline-none transform hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-10 h-10 ${i < rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-md' : 'text-gray-200 fill-gray-200'}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-3">تعليقك</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-secondary bg-secondary/50 focus:border-primary focus:bg-white outline-none transition-all resize-none"
            placeholder="اكتب رأيك هنا بحرية..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {myReview ? 'حفظ التعديلات' : 'نشر التقييم'}
          </button>
          {myReview && (
            <button
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="py-4 px-6 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-colors"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="حذف التقييم"
        message="هل أنت متأكد من حذف تقييمك؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        isLoading={isDeleting}
        onConfirm={() => {
          deleteReview(undefined, {
            onSettled: () => setShowDeleteConfirm(false)
          });
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </motion.div>
  );
}
