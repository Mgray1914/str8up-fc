import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scroll when loader unmounts
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="loader fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-[#0000004f]" style={{ zIndex: 999999}}>
      <div class="w-12 h-12 rounded-full animate-spin
                    border-y-4 border-solid border-green border-t-transparent shadow-md"></div>
    </div>
  );
}