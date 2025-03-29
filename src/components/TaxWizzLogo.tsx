
import { cn } from "@/lib/utils";

interface TaxWizzLogoProps {
  className?: string;
}

const TaxWizzLogo = ({ className }: TaxWizzLogoProps) => {
  return (
    <div className={cn("w-16 h-16 relative", className)}>
      <div className="absolute inset-0 bg-blue-600 rounded-lg transform rotate-45 opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-blue-600"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      </div>
    </div>
  );
};

export default TaxWizzLogo;
