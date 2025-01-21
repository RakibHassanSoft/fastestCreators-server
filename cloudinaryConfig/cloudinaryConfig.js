import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dvdyfyryz", // Replace with your Cloudinary cloud name
  api_key: "414746187667182", // Replace with your Cloudinary API key
  api_secret: "<your_api_secret>", // Replace with your Cloudinary API secret
});

export default cloudinary;
