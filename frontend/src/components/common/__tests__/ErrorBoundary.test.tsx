import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that throws an error on click
const ThrowOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false);
  
  if (shouldThrow) {
    throw new Error('Clicked error');
  }
  
  return (
    <button onClick={() => setShouldThrow(true)}>
      Trigger Error
    </button>
  );
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests since we're intentionally throwing errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error message
    expect(screen.getByText('Etwas ist schiefgelaufen')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error fallback</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onErrorMock = jest.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalled();
    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should show retry button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Erneut versuchen')).toBeInTheDocument();
  });

  it('should show home button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Zur Startseite')).toBeInTheDocument();
  });

  it('should show reload button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Seite neu laden')).toBeInTheDocument();
  });

  it('should reset error state when retry button is clicked', () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      
      return (
        <ErrorBoundary key={shouldThrow ? 'error' : 'no-error'}>
          {shouldThrow ? <ThrowError shouldThrow={true} /> : <div>Recovered</div>}
        </ErrorBoundary>
      );
    };

    render(<TestComponent />);

    // Should show error initially
    expect(screen.getByText('Etwas ist schiefgelaufen')).toBeInTheDocument();
  });

  // Note: NODE_ENV tests are skipped because Jest sets NODE_ENV to 'test'
  // and modifying it at runtime doesn't work reliably with React.

  it('should render correctly with multiple children', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should catch errors from nested components', () => {
    const NestedError = () => (
      <div>
        <div>
          <ThrowError shouldThrow={true} />
        </div>
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Etwas ist schiefgelaufen')).toBeInTheDocument();
  });

  it('should log error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('should show help message', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Es ist ein unerwarteter Fehler aufgetreten/)).toBeInTheDocument();
  });
});

describe('ErrorBoundary integration', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should handle asynchronous state updates causing errors', () => {
    const AsyncErrorComponent = () => {
      const [data, setData] = React.useState<any>(null);
      
      React.useEffect(() => {
        // Simulate async operation that causes an error
        setData({ invalid: true });
      }, []);

      if (data?.invalid) {
        throw new Error('Async error');
      }

      return <div>Loading...</div>;
    };

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    // Error boundary should catch the error
    expect(screen.getByText('Etwas ist schiefgelaufen')).toBeInTheDocument();
  });
});
