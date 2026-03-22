import { generateUploadDropzone } from "@uploadthing/react";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { uploadFiles } = genUploader<OurFileRouter>();
