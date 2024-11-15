import React from "react";

function ThreeDotIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="threeDotGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      <path
        d="M12.5641 16.5635C12.5641 15.5722 11.7605 14.7687 10.7692 14.7687C9.77796 14.7687 8.97437 15.5722 8.97437 16.5635C8.97437 17.5548 9.77796 18.3584 10.7692 18.3584C11.7605 18.3584 12.5641 17.5548 12.5641 16.5635Z"
        fill="url(#threeDotGradient)"
      />
      <path
        d="M12.5641 10.9737C12.5641 9.9824 11.7605 9.17881 10.7692 9.17881C9.77796 9.17881 8.97437 9.9824 8.97437 10.9737C8.97437 11.965 9.77796 12.7686 10.7692 12.7686C11.7605 12.7686 12.5641 11.965 12.5641 10.9737Z"
        fill="url(#threeDotGradient)"
      />
      <path
        d="M12.5641 5.38384C12.5641 4.39256 11.7605 3.58897 10.7692 3.58897C9.77796 3.58897 8.97437 4.39256 8.97437 5.38384C8.97437 6.37512 9.77796 7.17871 10.7692 7.17871C11.7605 7.17871 12.5641 6.37512 12.5641 5.38384Z"
        fill="url(#threeDotGradient)"
      />
    </svg>
  );
}

export default ThreeDotIcon;
