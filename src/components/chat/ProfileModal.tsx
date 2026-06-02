import { X, ChevronLeft, ChevronRight, MapPin, Heart, User2, MessageCircle, Sparkles } from "lucide-react";
import { users } from "@/data/mockData";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MatchType } from "@/hooks/useMatches";

interface Props {
  userId: string | null;
  onClose: () => void;
  onStartChat?: (userId: string) => void;
  matchType?: MatchType | null;
  canMatch?: boolean;
  onMatch?: (userId: string) => boolean | void;
  onUnmatch?: (userId: string) => void;
}

export default function ProfileModal({ userId, onClose, onStartChat, matchType = null, canMatch = true, onMatch, onUnmatch }: Props) {
  const user = users.find((u) => u.id === userId);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [localType, setLocalType] = useState<MatchType | null>(matchType);

  if (!user) return null;

  const photos = user.photos;
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);

  const interestLabel = user.interest === "Homens" ? "Gosta de homens" : user.interest === "Mulheres" ? "Gosta de mulheres" : "Gosta de ambos";

  const isMutual = localType === "mutual";
  const isReceived = localType === "received";
  const isGiven = localType === "given";

  const handleMatchClick = () => {
    if (isMutual) {
      // un-match
      onUnmatch?.(user.id);
      setLocalType(null);
      return;
    }
    if (isReceived) {
      // match back → becomes mutual
      const ok = onMatch?.(user.id);
      if (ok !== false) setLocalType("mutual");
      return;
    }
    if (isGiven) {
      onUnmatch?.(user.id);
      setLocalType(null);
      return;
    }
    if (!canMatch) return;
    const ok = onMatch?.(user.id);
    if (ok !== false) setLocalType("given");
  };

  const buttonConfig = isMutual
    ? { label: "Apaixonados", className: "bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/40" }
    : isReceived
      ? { label: "Dar Match de volta", className: "bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse" }
      : isGiven
        ? { label: "Match!", className: "bg-destructive text-destructive-foreground" }
        : canMatch
          ? { label: "Match", className: "bg-secondary text-foreground hover:bg-chat-hover" }
          : { label: "Match", className: "bg-secondary/50 text-muted-foreground cursor-not-allowed" };

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
          className={`relative w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
            isMutual ? "ring-4 ring-pink-500/60 shadow-pink-500/30" : ""
          }`}
        >
          {/* Mutual banner */}
          {isMutual && (
            <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-4 py-2 text-center text-white overflow-hidden">
              <motion.div
                className="flex items-center justify-center gap-2 text-sm font-bold tracking-wide"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <Sparkles size={16} />
                APAIXONADOS — vocês deram Match um para o outro!
                <Sparkles size={16} />
              </motion.div>
              {/* floating hearts */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute"
                  style={{ left: `${10 + i * 15}%`, bottom: 0 }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -40, opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                >
                  <Heart size={12} fill="white" className="text-white/90" />
                </motion.span>
              ))}
            </div>
          )}

          {/* Close button */}
          <button onClick={onClose} aria-label="Fechar" className="absolute right-3 top-3 z-10 rounded-full bg-secondary p-2 hover:bg-chat-hover transition-colors">
            <X size={18} className="text-foreground" />
          </button>

          {/* Photo Carousel */}
          <div className="relative h-80 bg-secondary">
            <img src={photos[photoIndex]} alt={user.name} className="h-full w-full object-cover" />
            {isMutual && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pink-500/30 via-transparent to-fuchsia-500/20" />
            )}
            {photos.length > 1 && (
              <>
                <button onClick={prevPhoto} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 hover:bg-background/80 transition-colors">
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <button onClick={nextPhoto} aria-label="Próxima foto" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/60 p-1.5 hover:bg-background/80 transition-colors">
                  <ChevronRight size={20} className="text-foreground" />
                </button>
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
            <div className="flex items-center gap-2">
              <h2 className={`text-2xl font-bold ${isMutual ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent" : "text-foreground"}`}>
                {user.name}
              </h2>
              {isReceived && (
                <span className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-600 dark:text-pink-400">
                  Te deu Match
                </span>
              )}
            </div>
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

            <div className="mt-5 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={!canMatch && !localType}
                title={!canMatch && !localType ? "Match disponível apenas entre gêneros opostos" : undefined}
                onClick={handleMatchClick}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${buttonConfig.className}`}
              >
                <motion.div
                  animate={isMutual ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : isGiven ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: isMutual ? 1.2 : 0.3, repeat: isMutual ? Infinity : 0 }}
                >
                  <Heart size={18} fill={isMutual || isGiven || isReceived ? "currentColor" : "none"} />
                </motion.div>
                {buttonConfig.label}
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
