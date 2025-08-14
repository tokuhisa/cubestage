import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface MarkdownContextValue {
  inputValues: Record<string, string>;
  setInputValue: (id: string, value: string) => void;
  executionResults: Record<string, ExecutionResult>;
  setExecutionResult: (id: string, result: ExecutionResult) => void;
  dispatchEvent: (eventId: string) => void;
  executionTriggers: Record<string, { timestamp: number }>;
}

const MarkdownContext = createContext<MarkdownContextValue | undefined>(undefined);

export const useMarkdownContext = () => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error('useMarkdownContext must be used within a MarkdownContextProvider');
  }
  return context;
};

export interface ExecutionResult {
  value?: unknown;
  error?: string;
  logs?: string[];
  display?: string;
}

interface MarkdownContextProviderProps {
  children: ReactNode;
}

export const MarkdownContextProvider = ({ children }: MarkdownContextProviderProps) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [executionResults, setExecutionResults] = useState<Record<string, ExecutionResult>>({});
  const [executionTriggers, setExecutionTriggers] = useState<Record<string, { timestamp: number }>>({});

  const setInputValue = useCallback((id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  }, []);

  const setExecutionResult = useCallback((id: string, result: ExecutionResult) => {
    setExecutionResults(prev => ({ ...prev, [id]: result }));
  }, []);

  const dispatchEvent = useCallback((eventId: string) => {
    console.log(`Dispatching event: ${eventId}`);
    setExecutionTriggers(prev => ({
      ...prev,
      [eventId]: { timestamp: Date.now() }
    }));
  }, []);

  return (
    <MarkdownContext.Provider
      value={{
        inputValues,
        setInputValue,
        executionResults,
        setExecutionResult,
        dispatchEvent,
        executionTriggers,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
};