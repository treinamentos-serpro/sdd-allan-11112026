import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AttributionFooter from '../../../src/components/AttributionFooter';

describe('AttributionFooter', () => {
  it('RNF-05: atribui os dados à Open-Meteo com link para o site', () => {
    render(<AttributionFooter />);

    const link = screen.getByRole('link', { name: /Open-Meteo\.com/ });

    expect(screen.getByRole('contentinfo')).toHaveTextContent('Dados meteorológicos por');
    expect(link).toHaveAttribute('href', 'https://open-meteo.com/');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});
