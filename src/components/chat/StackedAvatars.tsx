import { users } from "@/data/mockData";

interface Props {
  size?: number;
}

export default function StackedAvatars({ size = 40 }: Props) {
  const selectedUsers = users.filter(u => u.id !== "me").slice(0, 5);
  const photoSize = size * 0.7;
  const overlap = photoSize * 0.35;
  const totalWidth = photoSize + (selectedUsers.length - 1) * (photoSize - overlap);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: totalWidth, height: photoSize }}
    >
      {selectedUsers.map((user, i) => (
        <img
          key={user.id}
          src={user.avatar}
          alt=""
          className="absolute rounded-full object-cover border-2 border-background"
          style={{
            width: photoSize,
            height: photoSize,
            left: i * (photoSize - overlap),
            top: 0,
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}
