import * as React from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  variant?: "error" | "network" | "not-found";
  className?: string;
}

const errorConfig = {
  error: {
    icon: AlertCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    title: "something went wrong",
    message: "an unexpected error occurred. please try again.",
  },
  network: {
    icon: WifiOff,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    title: "connection lost",
    message: "check your internet connection and try again.",
  },
  "not-found": {
    icon: AlertCircle,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-50",
    title: "not found",
    message: "the resource you're looking for doesn't exist.",
  },
};

export function ErrorState({
  title,
  message,
  onRetry,
  retryText = "try again",
  variant = "error",
  className,
}: ErrorStateProps) {
  const config = errorConfig[variant];
  const IconComponent = config.icon;

  return (
    <Card className={cn("max-w-md mx-auto", className)}>
      <CardHeader className="text-center">
        <div className={cn("mx-auto mb-4 p-3 rounded-full w-fit", config.iconBg)}>
          <IconComponent className={cn("h-6 w-6", config.iconColor)} />
        </div>
        <CardTitle className={cn("text-lg", config.iconColor)}>
          {title || config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {message || config.message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="hover-scale">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Empty state component
interface EmptyStateProps {
  title: string;
  message: string;
  illustration?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "error" | "success";
  className?: string;
}

export function EmptyState({
  title,
  message,
  illustration,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const variantStyles = {
    default: "bg-gray-50",
    error: "bg-red-50",
    success: "bg-green-50",
  };

  return (
    <div className={cn("text-center py-16 px-6", className)}>
      <div className={cn("mx-auto mb-6 p-4 rounded-full w-fit", variantStyles[variant])}>
        {illustration || <div className="w-12 h-12 bg-gray-200 rounded-full" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg" className="hover-scale">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading state component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mb-4" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
