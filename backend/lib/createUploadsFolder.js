import { promises as fs } from "fs";

export const createUploadsFolder = async () => {
  try {
    await fs.access("uploads");
  } catch {
    await fs.mkdir("uploads");
  }
};
