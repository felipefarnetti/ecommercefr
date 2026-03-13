"use client";
import React, { useState, useTransition } from "react";
import ProfileAvatarInput from "@components/ProfileAvatarInput";
import { toast } from "react-toastify";
import { uploadImage } from "@utils/helper";
import { UpdateUserProfile } from "@app/(private_route)/profile/action";
import { UserProfileToUpdate } from "@app/types";
import { useRouter } from "next/navigation";

interface Props {
  avatar?: string;
  name: string;
  email: string;
  id: string;
}

export default function ProfileForm({ id, name, avatar, email }: Props) {
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [userName, setUserName] = useState(name);
  const router = useRouter();

  const avatarSource = avatarFile ? URL.createObjectURL(avatarFile) : avatar;
  const showSubmitButton = avatarSource !== avatar || userName !== name;

  const updateUserInfo = async () => {
    if (userName.trim().length < 3) return toast.error("Name is invalid");

    const info: UserProfileToUpdate = { id, name: userName };

    if (avatarFile) {
      const avatar = await uploadImage(avatarFile);
      info.avatar = avatar;
    }
    await UpdateUserProfile(info);
    router.refresh();
  };

  return (
    <form
      action={() => {
        startTransition(async () => {
          await updateUserInfo();
        });
      }}
      className="space-y-6"
    >
      <ProfileAvatarInput
        onChange={setAvatarFile}
        nameInitial={name[0]}
        avatar={avatarSource}
      />
      <div className="text-sm">Email: {email}</div>
      <div className="relative w-full">
        <input
          onChange={({ target }) => setUserName(target.value)}
          value={userName}
          placeholder=" "
          className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm font-semibold outline-none focus:border-blue-500 transition"
        />
        <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
          Nom
        </label>
      </div>
      {showSubmitButton ? (
        <button
          type="submit"
          className="w-32 lg:w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium uppercase hover:bg-blue-600 hover:scale-[0.98] disabled:opacity-50"
          disabled={isPending}
        >
          Envoyer
        </button>
      ) : null}
    </form>
  );
}
