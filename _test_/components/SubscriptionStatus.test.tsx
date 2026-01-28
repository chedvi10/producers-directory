import { render, screen } from '@testing-library/react';
import { SubscriptionStatus } from '@/components/dashboard/SubscriptionStatus';

describe('SubscriptionStatus', () => {
  it('מציג "אין מנוי פעיל" כשאין subscription', () => {
    render(<SubscriptionStatus />);
    expect(screen.getByText('אין מנוי פעיל')).toBeInTheDocument();
  });

  it('מציג "המנוי פג תוקף" למנוי שפג', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    
    render(<SubscriptionStatus subscription={{ expiryDate: pastDate.toISOString() }} />);
    expect(screen.getByText('המנוי פג תוקף')).toBeInTheDocument();
  });

  it('מציג מנוי פעיל עם ימים נותרים', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    
    render(<SubscriptionStatus subscription={{ expiryDate: futureDate.toISOString() }} />);
    expect(screen.getByText(/מנוי פעיל - \d+ ימים נותרו/)).toBeInTheDocument();
  });

  it('מציג רקע ירוק למנוי עם יותר מ-30 יום', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    
    const { container } = render(<SubscriptionStatus subscription={{ expiryDate: futureDate.toISOString() }} />);
    const statusDiv = container.querySelector('.bg-green-50');
    expect(statusDiv).toBeInTheDocument();
  });

  it('מציג רקע צהוב למנוי עם פחות מ-30 יום', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);
    
    const { container } = render(<SubscriptionStatus subscription={{ expiryDate: futureDate.toISOString() }} />);
    const statusDiv = container.querySelector('.bg-yellow-50');
    expect(statusDiv).toBeInTheDocument();
  });

  it('מציג רקע אדום למנוי שפג', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    
    const { container } = render(<SubscriptionStatus subscription={{ expiryDate: pastDate.toISOString() }} />);
    const statusDiv = container.querySelector('.bg-red-50');
    expect(statusDiv).toBeInTheDocument();
  });
});
