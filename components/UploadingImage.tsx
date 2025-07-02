// import { useState } from "react";

// export default function UploadPage() {
//   const [image, setImage] = useState(null);
//   const [url, setUrl] = useState("");
//   const [uploading, setUploading] = useState(false);

//   // Cloudinary configuration
//   const cloudName = "dcp2soyzn"; // Replace with your Cloudinary Cloud Name
//   const uploadPreset = "al-quran-institute"; // Replace with your Upload Preset Name

//   // Handle file selection
//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         alert("File is too large! Max size is 10MB.");
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         alert("Please select an image file!");
//         return;
//       }
//       setImage(file);
//     }
//   };

//   // Handle image upload
//   const handleUpload = async () => {
//     if (!image) {
//       alert("Please select an image first!");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", uploadPreset);
//     formData.append("cloud_name", cloudName);

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const data = await response.json();
//       if (data.secure_url) {
//         setUrl(data.secure_url);
//         alert("Image uploaded successfully!");
//       } else {
//         alert("Upload failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Error uploading image. Check console for details.");
//     } finally {
//       setUploading(false);
//     }
//   };
  

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Upload Image to Cloudinary
//       </h1>
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileSelect}
//           className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={uploading}
//           className={`w-full py-2 px-4 text-white font-semibold rounded ${
//             uploading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-500 hover:bg-blue-600"
//           } transition-colors duration-200`}
//         >
//           {uploading ? "Uploading..." : "Upload Image"}
//         </button>
//       </div>
//       {url && (
//         <div className="mt-6 w-full max-w-md">
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             Uploaded Image:
//           </h3>
//           <img
//             src={url}
//             alt="Uploaded"
//             className="w-full rounded-lg shadow-md mb-4"
//           />
//           <p className="text-sm text-gray-600 break-all">Image URL: {url}</p>
//         </div>
//       )}
//     </div>
//   );
// }
