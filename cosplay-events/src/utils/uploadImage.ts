import { storage } from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 */
export async function uploadToFirebaseStorage(file: File): Promise<string> {
  try {
    if (!file) throw new Error("No file provided for upload.");

    console.log("Starting image upload...");
    
    const fileName = `posts/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);

    console.log("Uploading to Firebase Storage...");
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    console.log("Upload successful! Fetching URL...");
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("Download URL received:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error during image upload:", error);
    throw new Error("Image upload failed");
  }
}
