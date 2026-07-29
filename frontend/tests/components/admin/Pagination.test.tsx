import { render, screen } from "@testing-library/react";
import Pagination from "@/components/admin/Pagination";
import { makePagination } from "../../utils/fixtures";

describe("Pagination", () => {
  it("shows only a result count when there is a single page", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 1, size: 10, total: 3, totalPages: 1 })}
      />
    );
    expect(screen.getByText("3 result(s)")).toBeInTheDocument();
  });

  it("does not render Prev/Next links when there is a single page", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 1, size: 10, total: 3, totalPages: 1 })}
      />
    );
    expect(screen.queryByText("Prev")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("renders a page link for every page when there are multiple pages", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 2, size: 10, total: 45, totalPages: 5 })}
      />
    );
    for (const page of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole("link", { name: String(page) })).toBeInTheDocument();
    }
  });

  it("shows the current page/total pages/result summary text", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 2, size: 10, total: 45, totalPages: 5 })}
      />
    );
    expect(screen.getByText("Page 2 of 5 · 45 result(s)")).toBeInTheDocument();
  });

  it("builds the correct href for a numbered page link", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 2, size: 10, total: 45, totalPages: 5 })}
      />
    );
    const link = screen.getByRole("link", { name: "3" });
    expect(link).toHaveAttribute("href", "/admin/users?page=3&size=10");
  });

  it("includes the encoded search term in generated hrefs", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 1, size: 10, total: 45, totalPages: 5 })}
        search="john doe"
      />
    );
    const link = screen.getByRole("link", { name: "2" });
    expect(link).toHaveAttribute(
      "href",
      "/admin/users?page=2&size=10&search=john%2520doe"
    );
  });

  it("marks the Prev link as disabled on the first page", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 1, size: 10, total: 45, totalPages: 5 })}
      />
    );
    const prev = screen.getByRole("link", { name: "Prev" });
    expect(prev).toHaveAttribute("aria-disabled", "true");
  });

  it("marks the Next link as disabled on the last page", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 5, size: 10, total: 45, totalPages: 5 })}
      />
    );
    const next = screen.getByRole("link", { name: "Next" });
    expect(next).toHaveAttribute("aria-disabled", "true");
  });

  it("highlights the current page with the active style", () => {
    render(
      <Pagination
        basePath="/admin/users"
        pagination={makePagination({ page: 3, size: 10, total: 45, totalPages: 5 })}
      />
    );
    const current = screen.getByRole("link", { name: "3" });
    expect(current.className).toContain("bg-green-700");
  });
});
