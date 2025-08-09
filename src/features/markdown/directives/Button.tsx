import { setupDirectiveNode } from "./directive";
import { useMarkdownContext } from "../MarkdownContext";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";

export const handleButtonNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  if (node.name !== "button") {
    return;
  }
  if (node.type !== "leafDirective") {
    return;
  }
  setupDirectiveNode(node);
};


export interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: "true" | "false";
  type?: 'button' | 'submit' | 'reset';
  eventId?: string; // ID to trigger JavaScript execution
  children?: React.ReactNode;
}

/**
 * Interactive button component for Markdown directives
 */
export const Button = (props: Props) => {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    eventId,
    children
  } = props;

  const { dispatchEvent } = useMarkdownContext();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    // Trigger JavaScript execution by eventId
    if (eventId) {
      console.log(`Button clicked, dispatching event: ${eventId}`);
      dispatchEvent(eventId);
    }
  };

  // Style variants
  const getVariantClasses = () => {
    const baseClasses = "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300`;
      case 'secondary':
        return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300`;
      case 'outline':
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300`;
    }
  };

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return "px-3 py-1.5 text-sm";
      case 'md':
        return "px-4 py-2 text-sm";
      case 'lg':
        return "px-6 py-3 text-base";
      default:
        return "px-4 py-2 text-sm";
    }
  };

  const buttonText = children && typeof children === 'string' ? children : 'Button';

  return (
    <button
      type={type}
      disabled={disabled === "true"}
      onClick={handleClick}
      className={`${getVariantClasses()} ${getSizeClasses()} my-2`}
    >
      {buttonText}
    </button>
  );
};