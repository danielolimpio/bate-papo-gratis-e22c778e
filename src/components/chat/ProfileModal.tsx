import { X, ChevronLeft, ChevronRight, MapPin, Heart, User2, MessageCircle } from "lucide-react";
import { users, type UserProfile } from "@/data/mockData";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  userId: string | null;
  onClose: () => void;
  onStartChat?: (userId: string) => void;
}

export default function ProfileModal({ userId, onClose, onStartChat }: Props) {
  const user = users.find((u) => u.id === userId);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [matched, setMatched] = useState(false);

  if (!user) return null;

  const photos = user.photos;
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);

  const interestLabel = user.interest === "Homens" ? "Gosta de homens" : user.interest === "Mulheres" ? "Gosta de mulheres" : "Gosta de ambos";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-secondary p-2 hover:bg-chat-hover transition-colors">
            <X size={18} className="text-foreground" />
          </button>

          {/* Photo Carousel */}
          <div className="relative h-80 bg-secondary">
            <img src={photos[photoIndex]} alt={user.name} className="h-full w-full object-cover" />
            {photos.length > 1 && (
              <>
                <button onClick={prevPhoto} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 hover:bg-background/80 transition-colors">
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <button onClick={nextPhoto} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 hover:bg-background/80 transition-colors">
                  <ChevronRight size={20} className="text-foreground" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <span key={i} className={`h-2 w-2 rounded-full transition-colors ${i === photoIndex ? "bg-primary" : "bg-foreground/30"}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.age} anos • {user.gender}</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin size={16} className="text-muted-foreground" />
                {user.city}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Heart size={16} className="text-primary" />
                {interestLabel}
              </div>
              {user.showRelationshipStatus && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <User2 size={16} className="text-muted-foreground" />
                  {user.relationshipStatus}
                </div>
              )}
            </div>

            {user.isOnline && (
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-online" />
                <span className="text-xs text-muted-foreground">Online agora</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMatched((v) => !v)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  matched
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-secondary text-foreground hover:bg-chat-hover"
                }`}
              >
                <motion.div
                  animate={matched ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={18} fill={matched ? "currentColor" : "none"} />
                </motion.div>
                {matched ? "Match!" : "Match"}
              </motion.button>

              <button
                onClick={() => {
                  if (onStartChat) onStartChat(user.id);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={18} />
                Conversar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
