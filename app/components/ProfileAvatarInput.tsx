import Image from "next/image";
import { PencilIcon } from "@heroicons/react/24/solid";

interface ProfileAvatarProps {
  avatar?: string;
  nameInitial: string;
  onChange?(file: File): void;
}

function ProfileAvatarInput({
  avatar,
  nameInitial,
  onChange,
}: ProfileAvatarProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative inline-block">
        {avatar ? (
          <Image
            src={avatar}
            alt="avatar"
            width={112}
            height={112}
            className="w-28 h-28 rounded-full object-cover"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center rounded-full border-2 border-slate-800 font-semibold text-xl">
            <span>{nameInitial}</span>
          </div>
        )}
        <label
          className="absolute top-2 right-0 rounded-full bg-slate-900/60 hover:bg-slate-900/80 transition"
          htmlFor="avatar"
        >
          <input
            onChange={({ target }) => {
              const { files } = target;
              if (files) onChange && onChange(files[0]);
            }}
            type="file"
            id="avatar"
            hidden
            accept="image/*"
          />
          <PencilIcon className="h-6 w-6 p-1 cursor-pointer text-white" />
        </label>
      </div>
    </div>
  );
}

export default ProfileAvatarInput;
