import { motion, AnimatePresence } from 'motion/react';
import { Plus, Loader2, Edit, Trash2, FileText, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { useAllResults, useDeleteResult } from '../../hooks/useResults';
import type { Result } from '../../api/resultsApi';
import { ImageLightbox } from '../../../components/ui/ImageLightbox';
import ConfirmModal from '../../../components/ConfirmModal';

interface ResultsSectionProps {
  onShowAddModal: () => void;
  onShowEditModal: (result: Result) => void;
}

export function ResultsSection({ onShowAddModal, onShowEditModal }: ResultsSectionProps) {
  const { data: resultsResponse, isLoading } = useAllResults();
  const { mutate: deleteResult, isPending: isDeleting } = useDeleteResult();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; images: string[]; initialIndex: number }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });

  const results = resultsResponse?.data || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">نتائج المرضى</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            إدارة وعرض قصص نجاح وتطور المرضى
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowAddModal}
          className="px-6 py-3 bg-gradient-to-br from-primary to-accent text-white rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة نتيجة جديدة</span>
        </motion.button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-primary">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-lg font-semibold">جاري التحميل...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/10 shadow-sm">
          <FileText className="w-16 h-16 text-primary/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
          <p className="text-muted-foreground">قم بإضافة نتائج وتطور المرضى لعرضها</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {results.map((result) => (
              <motion.div
                key={result.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-secondary/50">
                  {result.images && result.images.length > 0 ? (
                    <img 
                      src={result.images[0]} 
                      alt="نتيجة" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  {result.images && result.images.length > 0 && (
                    <button
                      onClick={() => setLightboxState({ isOpen: true, images: result.images, initialIndex: 0 })}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                    >
                      <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                    </button>
                  )}
                  {result.images && result.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-md">
                      +{result.images.length - 1} صور إضافية
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {result.description}
                  </p>
                  
                  <div className="text-xs text-muted-foreground mb-4">
                    {new Date(result.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                    <button
                      onClick={() => onShowEditModal(result)}
                      className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" /> تعديل
                    </button>
                    <button
                      onClick={() => setDeleteTarget(result.id)}
                      disabled={isDeleting}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        initialIndex={lightboxState.initialIndex}
        onClose={() => setLightboxState(s => ({ ...s, isOpen: false }))}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="حذف النتيجة"
        message="هل أنت متأكد من حذف هذه النتيجة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteTarget) {
            deleteResult(deleteTarget, {
              onSettled: () => setDeleteTarget(null)
            });
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
