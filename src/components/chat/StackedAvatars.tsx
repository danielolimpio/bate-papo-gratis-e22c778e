import { users } from "@/data/mockData";

interface Props {
  size?: number; // total container size
}

export default function StackedAvatars({ size = 40 }: Props) {
  // Pick 8 diverse users for the stack
  const selectedUsers = users.filter(u => u.id !== "me").slice(0, 8);
  const photoSize = size * 0.55;
  const center = size / 2;

  return (
    <div
      className="relative rounded-full overflow-hidden flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {selectedUsers.map((user, i) => {
        // Fan out like a deck of cards - bottom photos peek out at edges
        const angle = -20 + (i * (40 / 7)); // spread from -20° to +20°
        const offsetX = (i - 3.5) * (size * 0.06);
        const offsetY = Math.abs(i - 3.5) * (size * 0.02);

        return (
          <img
            key={user.id}
            src={user.avatar}
            alt=""
            className="absolute rounded-full object-cover border border-background"
            style={{
              width: photoSize,
              height: photoSize,
              left: center - photoSize / 2 + offsetX,
              top: center - photoSize / 2 + offsetY,
              transform: `rotate(${angle}deg)`,
              zIndex: i,
            }}
          />
        );
      })}
    </div>
  );
}
