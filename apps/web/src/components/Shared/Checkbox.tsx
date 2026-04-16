interface CheckboxProps {
  id: string;
  isChecked: boolean;
  isVisible: boolean;

  onChange: (
    isChecked: boolean,
    id: number | string,
    records?: number[],
  ) => void;
}

export default function Checkbox({
  id,
  isChecked,
  isVisible,
  onChange,
}: CheckboxProps) {
  return (
    <div className="inline-flex items-center">
      <label className="relative flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="hover:not-checked:bg-green-20 peer h-5 w-5 cursor-pointer appearance-none rounded border border-green-100 shadow transition-all checked:bg-green-100"
          id={id}
          hidden={!isVisible}
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked, id)}
        />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-white opacity-0 peer-checked:opacity-100">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3332 4L5.99984 11.3333L2.6665 8"
              stroke="#FDFDFD"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
    </div>
  );
}
