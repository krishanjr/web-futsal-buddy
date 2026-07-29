import { render, screen } from "@testing-library/react";
import InputField from "@/components/InputField";

describe("InputField", () => {
  it("renders the label text", () => {
    render(
      <InputField id="email" label="Email address" type="email" placeholder="you@example.com" />
    );
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("associates the label with the input via htmlFor/id", () => {
    render(
      <InputField id="email" label="Email address" type="email" placeholder="you@example.com" />
    );
    // getByLabelText only succeeds if htmlFor === input id
    const input = screen.getByLabelText("Email address");
    expect(input).toBeInTheDocument();
  });

  it("sets the input's name attribute equal to its id", () => {
    render(<InputField id="username" label="Username" type="text" placeholder="jdoe" />);
    const input = screen.getByLabelText("Username") as HTMLInputElement;
    expect(input.name).toBe("username");
    expect(input.id).toBe("username");
  });

  it("renders the correct input type", () => {
    render(<InputField id="password" label="Password" type="password" placeholder="••••••••" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("renders the placeholder text", () => {
    render(<InputField id="email" label="Email" type="email" placeholder="you@example.com" />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("is not required by default", () => {
    render(<InputField id="nickname" label="Nickname" type="text" placeholder="optional" />);
    const input = screen.getByLabelText("Nickname");
    expect(input).not.toBeRequired();
  });

  it("is required when the required prop is true", () => {
    render(
      <InputField id="email" label="Email" type="email" placeholder="you@example.com" required />
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeRequired();
  });

  it("forwards the autoComplete attribute when provided", () => {
    render(
      <InputField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />
    );
    const input = screen.getByLabelText("Email") as HTMLInputElement;
    expect(input.autocomplete).toBe("email");
  });
});
