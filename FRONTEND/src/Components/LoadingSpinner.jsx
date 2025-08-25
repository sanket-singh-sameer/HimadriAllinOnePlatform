import React from "react";

// Modern Black & White Full Page Loader
export const FullPageLoader = ({
  text = "Loading...",
  type = "minimalist",
  showProgress = false,
  progress = 0,
}) => {
  const renderSpinner = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex space-x-3">
            <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
          </div>
        );

      case "bars":
        return (
          <div className="flex items-end space-x-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-900 animate-pulse rounded-sm"
                style={{
                  width: "4px",
                  height: `${16 + (i % 3) * 8}px`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              ></div>
            ))}
          </div>
        );

      case "orbit":
        return (
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border border-gray-200 rounded-full"></div>
            <div className="absolute inset-1 border-2 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
            <div className="absolute inset-3 border border-transparent border-t-gray-500 rounded-full animate-spin reverse-spin"></div>
            <div className="absolute inset-5 w-6 h-6 bg-gray-900 rounded-full animate-pulse"></div>
          </div>
        );

      case "elegant":
        return (
          <div className="relative">
            <div className="w-20 h-20 border-2 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-t-gray-900 border-r-gray-900 rounded-full animate-spin"></div>
            <div className="absolute inset-4 w-12 h-12 border border-gray-300 rounded-full"></div>
            <div className="absolute inset-6 w-8 h-8 bg-gray-900 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-7 w-6 h-6 bg-gray-800 rounded-full"></div>
          </div>
        );

      case "minimalist":
      default:
        return (
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center p-12 bg-white shadow-2xl border border-gray-100 rounded-2xl max-w-md mx-4">
        <div className="mb-8 flex justify-center">{renderSpinner()}</div>

        <h3 className="text-gray-900 font-bold text-xl mb-2 tracking-tight">
          {text}
        </h3>

        <p className="text-gray-500 text-sm font-medium mb-6">
          Please wait while we process your request
        </p>

        {showProgress && (
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
            <div
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-center space-x-2">
          <div className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

// Sophisticated Black & White Button Loader
export const ButtonLoader = ({
  size = "md",
  variant = "dark",
  type = "spin",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const variantClasses = {
    dark: "border-white border-t-transparent",
    light: "border-gray-900 border-t-transparent",
    subtle: "border-gray-400 border-t-transparent",
  };

  if (type === "dots") {
    const dotColors = {
      dark: "bg-white",
      light: "bg-gray-900",
      subtle: "bg-gray-500",
    };

    return (
      <div className="flex space-x-1">
        <div
          className={`w-1.5 h-1.5 ${dotColors[variant]} rounded-full animate-bounce opacity-60`}
        ></div>
        <div
          className={`w-1.5 h-1.5 ${dotColors[variant]} rounded-full animate-bounce delay-100 opacity-80`}
        ></div>
        <div
          className={`w-1.5 h-1.5 ${dotColors[variant]} rounded-full animate-bounce delay-200`}
        ></div>
      </div>
    );
  }

  if (type === "pulse") {
    const pulseColors = {
      dark: "bg-white",
      light: "bg-gray-900",
      subtle: "bg-gray-500",
    };

    return (
      <div
        className={`${sizeClasses[size]} ${pulseColors[variant]} rounded-full animate-pulse`}
      ></div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} border-2 ${variantClasses[variant]} rounded-full animate-spin`}
    ></div>
  );
};

// Clean Inline Content Loader
export const InlineLoader = ({
  text = "Loading content...",
  size = "md",
  showText = true,
  variant = "light",
}) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full`}
        ></div>
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-t-gray-900 rounded-full animate-spin absolute inset-0`}
        ></div>
      </div>
      {showText && (
        <span className="text-gray-700 font-medium tracking-wide">{text}</span>
      )}
    </div>
  );
};

// Sophisticated Skeleton Loader
export const SkeletonLoader = ({
  lines = 3,
  showAvatar = false,
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <div className="w-12 h-12 bg-gray-200 rounded-full border border-gray-100"></div>
        )}
        <div className="flex-1 space-y-3">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="space-y-2">
              <div
                className="h-4 bg-gray-200 rounded border border-gray-100"
                style={{ width: `${100 - i * 10}%` }}
              ></div>
              {i === lines - 1 && (
                <div className="h-4 bg-gray-100 rounded border border-gray-50 w-2/3"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Elegant Page Loading Overlay
export const PageLoadingOverlay = ({ isLoading, children, type = "blur" }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div
        className={
          type === "blur"
            ? "filter blur-sm pointer-events-none opacity-50"
            : "pointer-events-none opacity-30"
        }
      >
        {children}
      </div>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-6">
          <InlineLoader showText={false} />
        </div>
      </div>
    </div>
  );
};

// Minimalist Card Loading State
export const CardLoader = ({ className = "" }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
    >
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-100 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

// Table Loading State
export const TableLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="px-6 py-4 border-b border-gray-100 last:border-b-0"
          >
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }, (_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default {
  FullPageLoader,
  ButtonLoader,
  InlineLoader,
  SkeletonLoader,
  PageLoadingOverlay,
  CardLoader,
  TableLoader,
};
