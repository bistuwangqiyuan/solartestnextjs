import { render, screen } from '@testing-library/react';
import { DataDisplay } from '@/components/ui/data-display';
import { Zap } from 'lucide-react';

describe('DataDisplay', () => {
  it('renders label and value correctly', () => {
    render(<DataDisplay label="电压" value="38.5" unit="V" />);
    
    expect(screen.getByText('电压')).toBeInTheDocument();
    expect(screen.getByText('38.5')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <DataDisplay 
        label="电压" 
        value="38.5" 
        unit="V" 
        icon={<Zap data-testid="icon" />} 
      />
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders trend indicator correctly', () => {
    render(<DataDisplay label="功率" value="300" unit="W" trend="up" />);
    expect(screen.getByText('上升')).toBeInTheDocument();
    
    render(<DataDisplay label="温度" value="25" unit="°C" trend="down" />);
    expect(screen.getByText('下降')).toBeInTheDocument();
    
    render(<DataDisplay label="电流" value="8.5" unit="A" trend="stable" />);
    expect(screen.getByText('稳定')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DataDisplay 
        label="测试" 
        value="100" 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles numeric values', () => {
    render(<DataDisplay label="数值" value={123.456} />);
    expect(screen.getByText('123.456')).toBeInTheDocument();
  });
});