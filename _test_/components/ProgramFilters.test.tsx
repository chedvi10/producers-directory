import { render, screen, fireEvent } from '@testing-library/react';
import { ProgramFilters } from '@/components/programs/ProgramFilters';

describe('ProgramFilters', () => {
  it('מציג את כל שדות החיפוש', () => {
    render(<ProgramFilters onFilterChange={() => {}} />);
    
    expect(screen.getByPlaceholderText('חיפוש תוכנית, מפיקה או מילת מפתח...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('₪ 0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('עיר או אזור')).toBeInTheDocument();
    expect(screen.getByText('כל הקטגוריות')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('גיל רצוי')).toBeInTheDocument();
  });

  it('קורא ל-onFilterChange כשמקלידים בחיפוש', () => {
    const onFilterChange = jest.fn();
    render(<ProgramFilters onFilterChange={onFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('חיפוש תוכנית, מפיקה או מילת מפתח...');
    fireEvent.change(searchInput, { target: { value: 'הרצאה' } });
    
    expect(onFilterChange).toHaveBeenCalledWith('search', 'הרצאה');
  });

  it('קורא ל-onFilterChange כשבוחרים קטגוריה', () => {
    const onFilterChange = jest.fn();
    render(<ProgramFilters onFilterChange={onFilterChange} />);
    
    const categorySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(categorySelect, { target: { value: 'הרצאות' } });
    
    expect(onFilterChange).toHaveBeenCalledWith('category', 'הרצאות');
  });

  it('קורא ל-onFilterChange כשמזינים מחיר', () => {
    const onFilterChange = jest.fn();
    render(<ProgramFilters onFilterChange={onFilterChange} />);
    
    const priceInput = screen.getByPlaceholderText('₪ 0');
    fireEvent.change(priceInput, { target: { value: '1000' } });
    
    expect(onFilterChange).toHaveBeenCalledWith('maxPrice', '1000');
  });
});
