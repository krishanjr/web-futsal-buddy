import { render, screen } from "@testing-library/react";
import SearchBar from "@/components/admin/SearchBar";

describe("SearchBar", () => {
  it("renders a search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("uses a default placeholder when none is provided", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("uses a custom placeholder when provided", () => {
    render(<SearchBar placeholder="Search users…" />);
    expect(screen.getByPlaceholderText("Search users…")).toBeInTheDocument();
  });

  it("pre-fills the input with the given defaultValue", () => {
    render(<SearchBar defaultValue="john" />);
    expect(screen.getByRole("textbox")).toHaveValue("john");
  });

  it("resets pagination to page 1 via a hidden field", () => {
    const { container } = render(<SearchBar />);
    const hidden = container.querySelector('input[type="hidden"][name="page"]');
    expect(hidden).toHaveValue("1");
  });

  it("renders a submit button labelled Search", () => {
    render(<SearchBar />);
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("submits via a GET form", () => {
    const { container } = render(<SearchBar />);
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("method", "GET");
  });
});
