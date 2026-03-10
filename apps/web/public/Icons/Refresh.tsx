import React from "react";

interface RefreshIconProps extends React.SVGProps<SVGSVGElement> {}

export const RefreshIcon = ({ className, ...props }: RefreshIconProps) => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 0.923077C3.19609 0.923077 0.923077 3.19609 0.923077 6C0.923077 8.80391 3.19609 11.0769 6 11.0769C8.80391 11.0769 11.0769 8.80391 11.0769 6C11.0769 5.7451 11.2836 5.53846 11.5385 5.53846C11.7934 5.53846 12 5.7451 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C7.70525 0 9.24399 0.711518 10.336 1.85287V0.461538C10.336 0.206638 10.5426 0 10.7975 0C11.0524 0 11.2591 0.206638 11.2591 0.461538V3.23077C11.2591 3.48567 11.0524 3.69231 10.7975 3.69231H8.07692C7.82202 3.69231 7.61539 3.48567 7.61539 3.23077C7.61539 2.97587 7.82202 2.76923 8.07692 2.76923H9.91653C8.98491 1.64112 7.57612 0.923077 6 0.923077Z"
        fill="currentColor"
      />
    </svg>
  );
};
