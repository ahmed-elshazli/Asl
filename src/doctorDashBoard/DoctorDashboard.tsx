import { AnimatePresence, motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useCreateConversation } from '../Messaging/hooks/useChat';

// import type { Patient } from './components/doctorDashboardData';

// Components
import { DoctorSidebar } from './components/DoctorSidebar';

// Sections
import { OverviewSection }  from './components/sections/OverviewSection';
import { PatientsSection }  from './components/sections/PatientsSection';
import { MessagesSection }  from './components/sections/MessagesSection';
import { PlansSection }     from './components/sections/PlansSection';
import { WorkoutsSection }  from './components/sections/WorkoutsSection';
import SubscriptionPlansSection from './components/sections/SubscriptionPlansSection';
import { ReviewsSection }   from './components/sections/ReviewsSection';
import { AboutUsSection }   from './components/sections/AboutUsSection';

// Modals - Patients
import { AddPatientModal }     from './modals/AddPatientModal';
import { PatientDetailsModal } from './modals/PatientDetailsModal';
import { EditPatientModal }    from './modals/EditPatientModal';
import { ChangePasswordModal } from './modals/ChangePasswordModal';

// Modals - Plans
import { AddPlanModal }    from './modals/AddPlanModal';
import { EditPlanModal }   from './modals/EditPlanModal';

// Modals - Workouts
import { AddExerciseModal }    from './modals/AddExerciseModal';
import { EditExerciseModal }   from './modals/EditExerciseModal';
import { AddProgramModal }     from './modals/AddProgramModal';
import { EditProgramModal }    from './modals/EditProgramModal';

// Modals - User Training Programs
import { AssignProgramModal }  from './modals/AssignProgramModal';
import { UserProgramsModal }   from './modals/UserProgramsModal';
import { ProgramUsersModal }   from './modals/ProgramUsersModal';
import { PatientStatsModal }   from './modals/PatientStatsModal';
import { UserPlansModal }      from './modals/UserPlansModal';

interface DoctorDashboardProps {
  onLogout: () => void;
}

export default function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  // ─── UI ───────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ─── Patients ─────────────────────────────────────────────────────────────
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId,  setEditingUserId]  = useState<string | null>(null);

  // ─── Messages ─────────────────────────────────────────────────────────────
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // ─── Plans ────────────────────────────────────────────────────────────────
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [viewingUserPlansId, setViewingUserPlansId] = useState<{id: string, name: string} | null>(null);

  // ─── Workouts ─────────────────────────────────────────────────────────────
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  // ─── User Training Programs ────────────────────────────────────────────────
  const [assigningProgramToUser, setAssigningProgramToUser] = useState<{id: string, name: string} | null>(null);
  const [showAssignProgram, setShowAssignProgram] = useState(false); // للحالات التي لا يتم فيها تحديد المريض مسبقاً
  const [viewingUserProgramsId, setViewingUserProgramsId] = useState<{id: string, name: string} | null>(null);
  const [viewingProgramUsersId, setViewingProgramUsersId] = useState<{id: string, title: string} | null>(null);
  const [viewingPatientStatsId, setViewingPatientStatsId] = useState<{id: string, name: string} | null>(null);

  // ─── Doctor ───────────────────────────────────────────────────────────────
  const [showChangePassword, setShowChangePassword] = useState(false);

  // ─── Chat Mutation ────────────────────────────────────────────────────────
  const { mutate: createConversation } = useCreateConversation();
  // const queryClient = useQueryClient();

  const handleMessagePatient = (patientId: string) => {
    createConversation(
      { participants: [patientId] },
      {
        onSuccess: (conversation) => {
          // فتح قسم الرسائل
          setActiveSection('messages');
          // تحديد المحادثة الجديدة
          setSelectedConversationId(conversation._id);
          // إغلاق مودال المريض
          setSelectedUserId(null);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hamburger - Mobile */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 right-4 z-40 lg:hidden w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-primary/10"
      >
        <Menu className="w-6 h-6 text-primary" />
      </motion.button>

      {/* Backdrop - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex">
        <DoctorSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={onLogout}
          onChangePassword={() => setShowChangePassword(true)}
        />

        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">
          {activeSection === 'overview' && (
            <OverviewSection
              onShowAddPatient={() => setShowAddPatient(true)}
            />
          )}
          {activeSection === 'patients' && (
            <PatientsSection
              onShowAddPatient={() => setShowAddPatient(true)}
              onSelectPatient={setSelectedUserId}
            />
          )}
          {activeSection === 'messages' && (
            <MessagesSection
              selectedConversationId={selectedConversationId}
              setSelectedConversationId={setSelectedConversationId}
            />
          )}
          {activeSection === 'plans' && (
            <PlansSection
              onShowAddPlan={() => setShowAddPlan(true)}
              onEditPlan={setEditingPlanId}
            />
          )}
          {activeSection === 'workouts' && (
            <WorkoutsSection
              onShowAddExercise={() => setShowAddExercise(true)}
              onEditExercise={setEditingExerciseId}
              onShowAddProgram={() => setShowAddProgram(true)}
              onEditProgram={setEditingProgramId}
              onShowProgramUsers={(id, title) => setViewingProgramUsersId({id, title})}
            />
          )}
          {activeSection === 'subscription-plans' && <SubscriptionPlansSection />}
          {activeSection === 'reviews' && <ReviewsSection />}
          {activeSection === 'about-us' && <AboutUsSection />}
        </main>
      </div>

      {/* ─── Modals ───────────────────────────────────────────────────────────── */}

      <AnimatePresence>
        {showAddPatient && (
          <AddPatientModal onClose={() => setShowAddPatient(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUserId && !editingUserId && (
          <PatientDetailsModal
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
            onDeleted={() => setSelectedUserId(null)}
            onEdit={(id) => { setSelectedUserId(null); setEditingUserId(id); }}
            onShowUserPrograms={(id, name) => { setSelectedUserId(null); setViewingUserProgramsId({id, name}); }}
            onShowUserPlans={(id, name) => { setSelectedUserId(null); setViewingUserPlansId({id, name}); }}
            onShowStats={(id, name) => { setSelectedUserId(null); setViewingPatientStatsId({id, name}); }}
            onMessage={handleMessagePatient}
            onAssignProgram={(id, name) => { 
              setSelectedUserId(null); 
              setAssigningProgramToUser({id, name}); 
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingUserId && (
          <EditPatientModal
            userId={editingUserId}
            onClose={() => setEditingUserId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddPlan && (
          <AddPlanModal onClose={() => setShowAddPlan(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingPlanId && (
          <EditPlanModal
            planId={editingPlanId}
            onClose={() => setEditingPlanId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddExercise && (
          <AddExerciseModal onClose={() => setShowAddExercise(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingExerciseId && (
          <EditExerciseModal
            exerciseId={editingExerciseId}
            onClose={() => setEditingExerciseId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddProgram && (
          <AddProgramModal onClose={() => setShowAddProgram(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProgramId && (
          <EditProgramModal
            programId={editingProgramId}
            onClose={() => setEditingProgramId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssignProgram && (
          <AssignProgramModal onClose={() => setShowAssignProgram(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {assigningProgramToUser && (
          <AssignProgramModal 
            preSelectedUser={assigningProgramToUser}
            onClose={() => setAssigningProgramToUser(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingUserProgramsId && (
          <UserProgramsModal
            userId={viewingUserProgramsId.id}
            userName={viewingUserProgramsId.name}
            onClose={() => setViewingUserProgramsId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingProgramUsersId && (
          <ProgramUsersModal
            programId={viewingProgramUsersId.id}
            programTitle={viewingProgramUsersId.title}
            onClose={() => setViewingProgramUsersId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingUserPlansId && (
          <UserPlansModal
            userId={viewingUserPlansId.id}
            userName={viewingUserPlansId.name}
            onClose={() => setViewingUserPlansId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingPatientStatsId && (
          <PatientStatsModal
            userId={viewingPatientStatsId.id}
            userName={viewingPatientStatsId.name}
            onClose={() => setViewingPatientStatsId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}