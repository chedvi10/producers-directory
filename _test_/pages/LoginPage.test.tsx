import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/login/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('LoginPage', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    localStorage.clear();
  });

  it('מציג את הטופס התחברות', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('התחברות מפיקות')).toBeInTheDocument();
    expect(screen.getByText('אימייל')).toBeInTheDocument();
    expect(screen.getByText('סיסמה')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'התחבר' })).toBeInTheDocument();
  });

  it('מציג לינק להרשמה', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByText('הירשמי כאן');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('מאפשר הקלדה בשדות', () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('סיסמה') as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('מתחבר בהצלחה ומנתב לדשבורד', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ producerId: '123' }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('producerId')).toBe('123');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('מציג שגיאה כשההתחברות נכשלת', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'אימייל או סיסמה שגויים' }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('אימייל או סיסמה שגויים')).toBeInTheDocument();
    });
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('מציג "מתחבר..." בזמן טעינה', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ producerId: '123' })
      }), 100))
    );

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('מתחבר...')).toBeInTheDocument();
  });

  it('מטפל בשגיאת רשת', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('שגיאה בהתחברות')).toBeInTheDocument();
    });
  });

  it('לא שולח טופס עם שדות רקים', async () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    fireEvent.click(submitButton);
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('מבטל כפתור בזמן טעינה', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ producerId: '123' })
      }), 100))
    );

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('שולח את הנתונים הנכונים ל-API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ producerId: '123' }),
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('אימייל');
    const passwordInput = screen.getByLabelText('סיסמה');
    const submitButton = screen.getByRole('button', { name: 'התחבר' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'mypassword' }),
      });
    });
  });
});
