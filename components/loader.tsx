interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "green" | "red" | "yellow" | "pink" | "purple";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const colorClasses = {
  blue: "text-gray-200 animate-spin dark:text-gray-600 fill-blue-600",
  gray: "text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300",
  green: "text-gray-200 animate-spin dark:text-gray-600 fill-green-500",
  red: "text-gray-200 animate-spin dark:text-gray-600 fill-red-600",
  yellow: "text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400",
  pink: "text-gray-200 animate-spin dark:text-gray-600 fill-pink-600",
  purple: "text-gray-200 animate-spin dark:text-gray-600 fill-purple-600",
};

export function LoadingSpinner({
  size = "md",
  color = "blue",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div role="status" className={className}>
      <svg
        aria-hidden="true"
        className={`inline ${sizeClasses[size]} ${colorClasses[color]}`}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function LoadingComponent() {
  return (
    <div className="p-8 space-y-8">
      {/* <div className="space-y-4">
        <h2 className="text-2xl font-bold">Loading Spinners</h2>
        <p className="text-gray-600">Various colored loading spinners with different sizes</p>
      </div> */}

      {/* Different Colors */}
      <div className="space-y-4">
        {/* <h3 className="text-lg font-semibold">Colors</h3> */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="text-center space-y-2">
            <LoadingSpinner size="lg" color="blue" />
            {/* <p className="text-sm text-gray-600">Blue</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner color="gray" />
            {/* <p className="text-sm text-gray-600">Gray</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="sm" color="green" />
            {/* <p className="text-sm text-gray-600">Green</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="lg" color="red" />
            {/* <p className="text-sm text-gray-600">Red</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="sm" color="yellow" />
            {/* <p className="text-sm text-gray-600">Yellow</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner color="pink" />
            {/* <p className="text-sm text-gray-600">Pink</p> */}
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="lg" color="purple" />
            {/* <p className="text-sm text-gray-600">Purple</p> */}
          </div>
        </div>
      </div>

      {/* Different Sizes */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex items-center gap-8">
          <div className="text-center space-y-2">
            <LoadingSpinner size="sm" color="blue" />
            <p className="text-sm text-gray-600">Small</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="md" color="blue" />
            <p className="text-sm text-gray-600">Medium</p>
          </div>
          <div className="text-center space-y-2">
            <LoadingSpinner size="lg" color="blue" />
            <p className="text-sm text-gray-600">Large</p>
          </div>
        </div>
      </div> */}

      {/* Usage Examples */}
      <div className="space-y-4">
        {/* <h3 className="text-lg font-semibold">Usage Examples</h3> */}
        <div className="space-y-4">
          <div className="flex items-center  justify-center gap-3 p-4 border rounded-lg">
            <LoadingSpinner color="blue" />
            <span>Processing data...</span>
          </div>

          {/* <div className="flex items-center justify-center gap-3 p-8 border rounded-lg bg-gray-50">
            <LoadingSpinner size="lg" color="green" />
            <span className="text-lg">Processing your request</span>
          </div> */}

          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md">
            <LoadingSpinner size="sm" color="blue" className="text-white fill-white" />
            <span>Submitting...</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
