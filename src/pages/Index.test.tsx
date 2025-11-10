import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Index from './Index';

// Import the mocked module
import * as authContext from '@/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Index Component', () => {
  const mockUseAuth = authContext.useAuth as jest.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the landing page for unauthenticated users', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      userRole: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText('Digital Notice Board')).toBeInTheDocument();
    expect(screen.getByText('Stay Updated with Campus Notices')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('redirects to faculty dashboard for authenticated faculty', async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '123' },
      userRole: 'faculty',
      loading: false,
    });

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/faculty');
    });
  });

  it('redirects to student dashboard for authenticated student', async () => {
    mockUseAuth.mockReturnValue({
      user: { uid: '456' },
      userRole: 'student',
      loading: false,
    });

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/student');
    });
  });
});
