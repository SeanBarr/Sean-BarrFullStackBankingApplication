import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import { ContextProvider } from '../context/Context'
import Deposit from "./Deposit";

test("Test the deposit page", async () => {
    render(
        <ContextProvider>
            <Deposit />
        </ContextProvider>
    )
    const amountInput = screen.getByLabelText("Deposit Amount")
    const depositButton = screen.getByText(/Deposit Money/i)
    const currentBalance = screen.getByText(/Your current balance: \$/i)
    expect(amountInput.value).toBe("")
    expect(currentBalance.textContent).toBe("Your current balance: $0")
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.click(depositButton)
    await waitFor(() => {
        expect(screen.getByText('You have successfully deposited $100 to your balance!')).toBeInTheDocument()
        expect(screen.getByText(/OK/i)).toBeInTheDocument()
        expect(amountInput.value).toBe("100")
        fireEvent.click(screen.getByText(/OK/i))
        expect(screen.getByText('Your current balance: $100')).toBeInTheDocument()
        expect(amountInput.value).toBe("")
    })
});