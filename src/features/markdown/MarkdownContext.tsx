import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface MarkdownContextValue {
  inputValues: Record<string, string>;
  setInputValue: (id: string, value: string) => void;
  executionResults: Record<string, unknown>;
  setExecutionResult: (id: string, result: unknown) => void;
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

interface MarkdownContextProviderProps {
  children: ReactNode;
}

export const MarkdownContextProvider = ({ children }: MarkdownContextProviderProps) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [executionResults, setExecutionResults] = useState<Record<string, unknown>>({});
  const [executionTriggers, setExecutionTriggers] = useState<Record<string, { timestamp: number }>>({});

  const setInputValue = useCallback((id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  }, []);

  const setExecutionResult = useCallback((id: string, result: unknown) => {
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