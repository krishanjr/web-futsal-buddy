import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionButton from "@/components/admin/ActionButton";

describe("ActionButton", () => {
  it("renders the given label", () => {
    render(<ActionButton action={jest.fn().mockResolvedValue(undefined)} label="Approve" />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("calls the action when clicked", async () => {
    const user = userEvent.setup();
    const action = jest.fn().mockResolvedValue(undefined);
    render(<ActionButton action={action} label="Approve" />);

    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
  });

  it("applies a custom className when provided", () => {
    render(
      <ActionButton
        action={jest.fn().mockResolvedValue(undefined)}
        label="Approve"
        className="my-custom-class"
      />
    );
    expect(screen.getByRole("button", { name: "Approve" })).toHaveClass("my-custom-class");
  });

  it("falls back to the default className when none is provided", () => {
    render(<ActionButton action={jest.fn().mockResolvedValue(undefined)} label="Approve" />);
    expect(screen.getByRole("button", { name: "Approve" })).toHaveClass("text-gray-600");
  });

  it("re-enables the button after the action resolves", async () => {
    const user = userEvent.setup();
    const action = jest.fn().mockResolvedValue(undefined);
    render(<ActionButton action={action} label="Approve" />);

    const button = screen.getByRole("button", { name: "Approve" });
    await user.click(button);

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
