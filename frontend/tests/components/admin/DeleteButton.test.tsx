import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteButton from "@/components/admin/DeleteButton";

describe("DeleteButton", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the default 'Delete' label", () => {
    render(<DeleteButton action={jest.fn().mockResolvedValue(undefined)} />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders a custom label when provided", () => {
    render(<DeleteButton action={jest.fn().mockResolvedValue(undefined)} label="Remove user" />);
    expect(screen.getByRole("button", { name: "Remove user" })).toBeInTheDocument();
  });

  it("asks for confirmation before deleting", async () => {
    const user = userEvent.setup();
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    const action = jest.fn().mockResolvedValue(undefined);
    render(<DeleteButton action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this? This cannot be undone."
    );
  });

  it("uses a custom confirmation message when provided", async () => {
    const user = userEvent.setup();
    const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);
    render(<DeleteButton action={jest.fn().mockResolvedValue(undefined)} confirmText="Delete this team?" />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(confirmSpy).toHaveBeenCalledWith("Delete this team?");
  });

  it("does not call the action when the confirmation is cancelled", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(false);
    const action = jest.fn().mockResolvedValue(undefined);
    render(<DeleteButton action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(action).not.toHaveBeenCalled();
  });

  it("calls the action when the confirmation is accepted", async () => {
    const user = userEvent.setup();
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const action = jest.fn().mockResolvedValue(undefined);
    render(<DeleteButton action={action} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
  });
});
