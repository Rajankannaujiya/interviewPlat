export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_NAME;

    console.log("this is the cloudName", cloudName, uploadPreset);

    if (!cloudName || !uploadPreset) {
      throw new Error("Either cloudName or uploadPresent or both are missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.log(error);
    return null
  }
};
