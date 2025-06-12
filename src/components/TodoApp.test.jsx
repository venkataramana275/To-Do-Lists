import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import TodoApp from "./TodoApp"; 

describe("TodoApp Component", () => {
  it("renders the header", () => {
    render(<TodoApp />);
    expect(screen.getByText(/To-Do Lists/i)).toBeInTheDocument();
  });

  it("adds a new task", () => {
    const { container } = render(<TodoApp />);

    fireEvent.change(screen.getByPlaceholderText("Enter task..."), {
      target: { value: "Learn Testing" },
    });

    const dateInput = container.querySelector('input[type="date"]');
      fireEvent.change(dateInput, {
      target: { value: "2025-06-12" },
    });

    fireEvent.change(screen.getByDisplayValue("🟡 Medium"), {
      target: { value: "high" },
    });

    fireEvent.click(screen.getByText(/add/i));   

    expect(screen.getByText(/Learn Testing/i)).toBeInTheDocument();
  });

  it("toggles dark mode", () => {
    render(<TodoApp />);
    const toggleBtn = screen.getByRole("button", { name: /dark mode/i });
    fireEvent.click(toggleBtn);
    expect(document.body.classList.contains("dark")).toBe(true);
  });
});

