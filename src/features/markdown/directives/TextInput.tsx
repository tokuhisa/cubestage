import { useState, useId, useEffect } from "react";
import { useMarkdownContext } from "../MarkdownContext";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import { setupDirectiveNode } from "./directive";

export const handleTextInputNode = (
  node: ContainerDirective | LeafDirective | TextDirective,
) => {
  if (node.name !== "textinput") {
    return;
  }
  if (node.type !== "leafDirective") {
    return;
  }
  setupDirectiveNode(node);
};

export interface Props {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  required?: "true" | "false";
  disabled?: "true" | "false";
  label?: string;
  children?: React.ReactNode;
}

/**
 * Interactive text input component for Markdown directives
 */
export const TextInput = (props: Props) => {
  const {
    name,
    placeholder = "Enter text...",
    defaultValue = "",
    type = "text",
    required = false,
    disabled = false,
    label,
    children
  } = props;

  const [isDirty, setIsDirty] = useState(false);
  const generatedId = useId();
  const inputId = name ?? generatedId;
  const { setInputValue, inputValues } = useMarkdownContext();
  const value = inputValues[inputId] || defaultValue;

  useEffect(() => {
    setInputValue(inputId, defaultValue);
  }, [defaultValue, setInputValue, inputId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setIsDirty(true);
    // Store value in context for access by other components
    setInputValue(inputId, newValue);
  };

  const handleReset = () => {
    setIsDirty(false);
    setInputValue(inputId, defaultValue);
  };

  const labelText = label ?? (children && typeof children === 'string' ? children : undefined);

  return (
    <div className="border border-gray-200 rounded-lg p-4 my-4 bg-white">
      <div className="space-y-3">
        {labelText && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {labelText}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="flex gap-2">
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required === "true"}
            disabled={disabled === "true"}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset
            </button>
          )}
        </div>

        {required && !value && isDirty && (
          <p className="text-sm text-red-600">
            This field is required
          </p>
        )}
      </div>
    </div>
  );
};