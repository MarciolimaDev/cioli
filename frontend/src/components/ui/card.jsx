import React from "react";

export const Card = React.forwardRef(function Card(
  { className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`.trim()}
      {...props}
    />
  );
});

export const CardContent = React.forwardRef(function CardContent(
  { className = "", ...props },
  ref
) {
  return <div ref={ref} className={`p-6 ${className}`.trim()} {...props} />;
});
