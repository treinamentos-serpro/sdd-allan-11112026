import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../../src/components/UnitToggle';
import type { Unit } from '../../../src/types/weather';

function setup(unit: Unit = 'celsius') {
  const onChange = vi.fn();
  const view = render(<UnitToggle unit={unit} onChange={onChange} />);
  return { onChange, user: userEvent.setup(), ...view };
}

const celsius = () => screen.getByRole('button', { name: /Celsius/ });
const fahrenheit = () => screen.getByRole('button', { name: /Fahrenheit/ });

describe('UnitToggle', () => {
  it('agrupa dois botões sob um grupo com nome acessível', () => {
    setup();

    const group = screen.getByRole('group', { name: 'Unidade de temperatura' });

    expect(group).toContainElement(celsius());
    expect(group).toContainElement(fahrenheit());
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(celsius()).toHaveTextContent('°C');
    expect(fahrenheit()).toHaveTextContent('°F');
  });

  it('WCAG 2.5.3: o nome acessível começa com o texto visível do botão', () => {
    setup();

    expect(celsius()).toHaveAccessibleName('°C Celsius');
    expect(fahrenheit()).toHaveAccessibleName('°F Fahrenheit');
  });

  it('marca só o botão ativo com aria-pressed', () => {
    setup('celsius');

    expect(celsius()).toHaveAttribute('aria-pressed', 'true');
    expect(fahrenheit()).toHaveAttribute('aria-pressed', 'false');
  });

  it('acompanha a prop unit quando ela muda', () => {
    const { rerender, onChange } = setup('celsius');

    rerender(<UnitToggle unit="fahrenheit" onChange={onChange} />);

    expect(celsius()).toHaveAttribute('aria-pressed', 'false');
    expect(fahrenheit()).toHaveAttribute('aria-pressed', 'true');
  });

  it('chama onChange com a unidade escolhida ao clicar no botão inativo', async () => {
    const { onChange, user } = setup('celsius');

    await user.click(fahrenheit());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });

  it('não chama onChange ao clicar no botão que já está ativo', async () => {
    const { onChange, user } = setup('fahrenheit');

    await user.click(fahrenheit());

    expect(onChange).not.toHaveBeenCalled();
  });

  it('percorre os botões com Tab, na ordem °C e °F', async () => {
    const { user } = setup();

    await user.tab();
    expect(celsius()).toHaveFocus();

    await user.tab();
    expect(fahrenheit()).toHaveFocus();
  });

  it('alterna a unidade com Enter e com Espaço', async () => {
    const { onChange, user } = setup('celsius');

    fahrenheit().focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'fahrenheit');
    expect(onChange).toHaveBeenNthCalledWith(2, 'fahrenheit');
  });
});
