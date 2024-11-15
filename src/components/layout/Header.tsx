import Navbar from "./Navbar";

export default function Header() {
  return (
    <div className="max-w-[1400px] mx-auto flex justify-between h-[76px] px-4 md:px-8 p-10">
      <Navbar></Navbar>
    </div>
  );
}
