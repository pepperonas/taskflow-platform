// This file runs BEFORE the test environment is set up
// It's used to mock globals that are accessed at module load time

// Create a simple storage mock (without jest.fn since jest isn't available here)
class StorageMock implements Storage {
  private store: Record<string, string> = {};
  
  get length(): number {
    return Object.keys(this.store).length;
  }
  
  clear(): void {
    this.store = {};
  }
  
  getItem(key: string): string | null {
    return this.store[key] || null;
  }
  
  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
  
  removeItem(key: string): void {
    delete this.store[key];
  }
  
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

// Mock localStorage
Object.defineProperty(global, 'localStorage', {
  value: new StorageMock(),
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(global, 'sessionStorage', {
  value: new StorageMock(),
  writable: true,
});

// Note: Jest globals (jest, describe, etc.) are injected by Jest after this file runs
// This file only sets up storage mocks that are needed before module loading
