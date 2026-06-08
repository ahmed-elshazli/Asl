import { motion } from 'motion/react';
import { Send, Crown, Lock, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface MessagingProps {
  onPremiumAction: (action: () => void) => void;
  isPremium: boolean;
}

export default function Messaging({ onPremiumAction, isPremium }: MessagingProps) {
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      doctor: 'د. سارة أحمد',
      specialty: 'أخصائية تغذية علاجية',
      lastMessage: 'سأرسل لك الخطة الغذائية المحدثة قريباً',
      time: 'منذ ساعتين',
      unread: 2,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'doctor',
      text: 'مرحباً! كيف كان أسبوعك مع الخطة الغذائية الجديدة؟',
      time: '10:30 صباحاً',
    },
    {
      id: 2,
      sender: 'user',
      text: 'كان رائعاً! التزمت بجميع الوجبات ولاحظت تحسناً في مستوى الطاقة',
      time: '10:45 صباحاً',
    },
    {
      id: 3,
      sender: 'doctor',
      text: 'هذا ممتاز! دعنا نزيد قليلاً من البروتين في وجبة الإفطار',
      time: '11:00 صباحاً',
    },
    {
      id: 4,
      sender: 'user',
      text: 'حسناً، هل يمكنك إرسال بعض الاقتراحات؟',
      time: '11:15 صباحاً',
    },
    {
      id: 5,
      sender: 'doctor',
      text: 'سأرسل لك الخطة الغذائية المحدثة قريباً',
      time: '11:30 صباحاً',
    },
  ];

  const handleSendMessage = () => {
    if (!isPremium) {
      onPremiumAction(() => {});
      return;
    }
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!isPremium) {
    return (
      <div className="p-6 md:p-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
            المراسلة المباشرة
          </h1>
          <p className="text-muted-foreground text-lg mb-12">تواصل مع طبيبك الخاص</p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary p-12 rounded-[3rem] text-white text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

            <div className="relative">
              <div className="inline-flex p-6 bg-white/20 backdrop-blur-xl rounded-3xl mb-6">
                <Lock className="w-16 h-16" />
              </div>

              <h2 className="text-3xl font-bold mb-4">ميزة حصرية للمشتركين</h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                احصل على الاشتراك المميز للتواصل المباشر مع طبيبك الخاص والحصول على استشارات فورية
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPremiumAction(() => {})}
                className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl inline-flex items-center gap-3"
              >
                <Crown className="w-6 h-6" />
                <span>اشترك الآن</span>
              </motion.button>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <Sparkles className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">رد فوري</h3>
                  <p className="text-sm text-white/80">احصل على إجابات سريعة لأسئلتك</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <MessageCircle className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">دعم مستمر</h3>
                  <p className="text-sm text-white/80">تواصل مع طبيبك في أي وقت</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl">
                  <Crown className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">خطط مخصصة</h3>
                  <p className="text-sm text-white/80">احصل على خطة غذائية مخصصة لك</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
          المراسلة المباشرة
        </h1>
        <p className="text-muted-foreground text-lg mb-8">تواصل مع طبيبك الخاص</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-3xl border-2 border-primary shadow-lg cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    د.س
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">{conv.doctor}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{conv.specialty}</p>
                    <p className="text-sm text-foreground/70 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                      {conv.unread > 0 && (
                        <div className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl border border-primary/10 shadow-lg overflow-hidden flex flex-col"
            style={{ height: '600px' }}
          >
            <div className="bg-gradient-to-br from-primary to-accent p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center font-bold text-lg">
                  د.س
                </div>
                <div>
                  <h3 className="font-bold">د. سارة أحمد</h3>
                  <p className="text-sm text-white/80">متصلة الآن</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-secondary text-foreground rounded-br-sm'
                        : 'bg-gradient-to-br from-primary to-accent text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="mb-1">{msg.text}</p>
                    <p
                      className={`text-xs ${
                        msg.sender === 'user' ? 'text-muted-foreground' : 'text-white/70'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-primary/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 px-6 py-4 bg-secondary rounded-full border-none outline-none focus:ring-2 focus:ring-primary"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
