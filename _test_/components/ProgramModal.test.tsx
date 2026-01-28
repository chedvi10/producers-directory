import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramModal } from '@/components/programs/ProgramModal';

const mockProgram = {
  id: '1',
  title: 'תוכנית מודל',
  description: 'תיאור מפורט של התוכנית',
  category: 'אטרקציות',
  targetAge: '13-18',
  duration: '2 שעות',
  location: 'ירושלים',
  price: 300,
  producer: {
    name: 'שרה כהן',
    phone: '050-1234567',
  },
};

describe('ProgramModal', () => {
  it('מציג את כל פרטי התוכנית', () => {
    render(<ProgramModal program={mockProgram} onClose={() => {}} />);
    
    expect(screen.getByText('תוכנית מודל')).toBeInTheDocument();
    expect(screen.getByText('תיאור מפורט של התוכנית')).toBeInTheDocument();
    expect(screen.getByText('13-18')).toBeInTheDocument();
    expect(screen.getByText('ירושלים')).toBeInTheDocument();
    expect(screen.getByText('2 שעות')).toBeInTheDocument();
    expect(screen.getByText('₪300')).toBeInTheDocument();
    expect(screen.getByText(/שרה כהן - 050-1234567/)).toBeInTheDocument();
  });

  it('קורא ל-onClose כשלוחצים על X', () => {
    const onClose = jest.fn();
    render(<ProgramModal program={mockProgram} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('קורא ל-onClose כשלוחצים על הרקע', () => {
    const onClose = jest.fn();
    const { container } = render(<ProgramModal program={mockProgram} onClose={onClose} />);
    
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('לא סוגר כשלוחצים על תוכן המודל', () => {
    const onClose = jest.fn();
    render(<ProgramModal program={mockProgram} onClose={onClose} />);
    
    const modalContent = screen.getByText('תוכנית מודל').closest('div');
    if (modalContent) fireEvent.click(modalContent);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('לא מציג מחיר אם אין', () => {
    const programWithoutPrice = { ...mockProgram, price: null };
    render(<ProgramModal program={programWithoutPrice} onClose={() => {}} />);
    
    expect(screen.queryByText(/₪/)).not.toBeInTheDocument();
  });
});
