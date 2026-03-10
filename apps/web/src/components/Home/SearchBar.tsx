import Image from "next/image";

// TODO: Add search functionality when backend is complete
export default function SearchBar() {
  return (
    <div className="focus-within:border-primary-green-1 mx-4.5 flex h-13 items-center gap-3 rounded-xl border-[0.5px] border-gray-300 bg-white px-5 py-4 transition-colors">
      <Image
        src="/Icons/SearchIcon.svg"
        alt="Search Icon"
        width={20}
        height={20}
      />
      <input
        type="text"
        placeholder="Search Manually"
        className="w-full bg-transparent text-[#1a1a1a] outline-none placeholder:text-[#b3b3b3]"
      />
    </div>
  );
}
