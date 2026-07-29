import { render, screen } from "@testing-library/react";
import AuthLayout from "@/components/AuthLayout";

describe("AuthLayout", () => {
  it("renders the Futsal Buddy brand name", () => {
    render(
      <AuthLayout>
        <p>content</p>
      </AuthLayout>
    );
    expect(screen.getByText("Futsal Buddy")).toBeInTheDocument();
  });

  it("renders the logo image with the correct alt text", () => {
    render(
      <AuthLayout>
        <p>content</p>
      </AuthLayout>
    );
    expect(screen.getByAltText("Futsal Buddy")).toBeInTheDocument();
  });

  it("renders the children passed to it", () => {
    render(
      <AuthLayout>
        <p>Sign in to continue</p>
      </AuthLayout>
    );
    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
  });
});
