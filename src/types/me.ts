type ApiResponse = {
  success: boolean;
  message: string;
};

type Profile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: null | string;
  avatarUrl: null | string;
  createdAt: string;
};

type Stats = {
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

type GetMeRes = ApiResponse & {
  data: {
    profile: Profile;
    stats: Stats;
  };
};

type PatchMeReq = {
  name: string;
  username: string;
  phone: string;
  bio: string;
} & (
  | { avatar: File; avatarUrl?: undefined }
  | { avatar?: undefined; avatarUrl: string }
);

type PatchMeRes = ApiResponse & {
  data: Omit<Profile, 'createdAt'> & {
    updatedAt: string;
  };
};

export type { GetMeRes, PatchMeReq, PatchMeRes };
