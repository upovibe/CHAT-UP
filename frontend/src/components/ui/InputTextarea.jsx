import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const InputTextarea = React.forwardRef(({ className, maxHeight = 200, ...props }, ref) => {
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-auto",
        className
      )}
      style={{ maxHeight: `${maxHeight}px` }}
      onInput={handleInput}
      ref={ref}
      {...props}
    />
  );
});

InputTextarea.displayName = "InputTextarea";

InputTextarea.propTypes = {
    className: PropTypes.string,
    maxHeight: PropTypes.number,
  };

export { InputTextarea };
