import faker from "faker";

export const generateFakerAvatar = () => faker.image.avatar();
export const generateFakerAnimal = () => faker.image.animals();

export const generateUnsplashImage = (query) =>
  `https://source.unsplash.com/random/200x200/?${query ?? "avatar"}`;

export const generateDiceBearAvataaars = (seed) =>
  `https://avatars.dicebear.com/api/avataaars/${seed}.svg`;

export const generateDiceBearBottts = (seed) =>
  `https://avatars.dicebear.com/api/bottts/${seed}.svg`;

export const generateDiceBearGridy = (seed) =>
  `https://avatars.dicebear.com/api/gridy/${seed}.svg`;
