import Image from "next/image";

export default function Logo({ size = 32 }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-md">
      {/* <Image
        src="/logo.png"
        alt="Aarogya Aadhar"
        width={size}
        height={size}
        className="object-contain"
      /> */}
      <span className="text-sm font-semibold text-gray-800">
        Aarogya Aadhar
      </span>
    </div>
  );
}