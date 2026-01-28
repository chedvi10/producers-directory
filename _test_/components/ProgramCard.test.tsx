import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramCard } from '@/components/dashboard/ProgramCard';

const mockProgram = {
  id: '1',
  title: 'תוכנית בדיקה',
  description: 'תיאור התוכנית לבדיקה',
  category: 'הרצאות',
  targetAge: '6-12',
  location: 'תל אביב',
  price: 500,
  createdAt: '2024-01-01',
};

describe('ProgramCard', () => {
  it('מציג את כל פרטי התוכנית', () => {
    render(<ProgramCard program={mockProgram} onDelete={() => {}} />);
    
    expect(screen.getByText('תוכנית בדיקה')).toBeInTheDocument();
    expect(screen.getByText('תיאור התוכנית לבדיקה')).toBeInTheDocument();
    expect(screen.getByText('הרצאות')).toBeInTheDocument();
    expect(screen.getByText('גיל: 6-12')).toBeInTheDocument();
    expect(screen.getByText('מיקום: תל אביב')).toBeInTheDocument();
    expect(screen.getByText('מחיר: ₪500')).toBeInTheDocument();
  });

  it('לא מציג מחיר אם אין', () => {
    const programWithoutPrice = { ...mockProgram, price: null };
    render(<ProgramCard program={programWithoutPrice} onDelete={() => {}} />);
    
    expect(screen.queryByText(/מחיר:/)).not.toBeInTheDocument();
  });

  it('קורא ל-onDelete כשלוחצים על כפתור מחק', () => {
    const onDelete = jest.fn();
    render(<ProgramCard program={mockProgram} onDelete={onDelete} />);
    
    const deleteButton = screen.getByText('מחק');
    fireEvent.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('מציג כפתור ערוך עם לינק נכון', () => {
    render(<ProgramCard program={mockProgram} onDelete={() => {}} />);
    
    const editButton = screen.getByText('ערוך').closest('a');
    expect(editButton).toHaveAttribute('href', '/dashboard/edit/1');
  });
});
