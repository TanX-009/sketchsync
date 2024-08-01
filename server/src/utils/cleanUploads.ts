import fs from "fs";
import path from "path";

// Function to remove files based on their names containing a certain string
export default async function cleanUploads(
  searchString: string,
): Promise<void> {
  const dirPath = "public/uploads";

  try {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      if (file.includes(searchString)) {
        const filePath = path.join(dirPath, file);

        // Check if it's a file (not a directory)
        const stats = await fs.promises.stat(filePath);
        if (stats.isFile()) {
          await fs.promises.unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
