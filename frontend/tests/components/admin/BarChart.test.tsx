import { render, screen } from "@testing-library/react";
import BarChart from "@/components/admin/BarChart";

describe("BarChart", () => {
  it("shows a placeholder message when there is no data", () => {
    render(<BarChart data={[]} labelKey="month" valueKey="count" />);
    expect(screen.getByText("No data yet.")).toBeInTheDocument();
  });

  it("renders a label for every data point", () => {
    render(
      <BarChart
        data={[
          { month: "Jan", count: 5 },
          { month: "Feb", count: 10 },
        ]}
        labelKey="month"
        valueKey="count"
      />
    );
    expect(screen.getByText("Jan")).toBeInTheDocument();
    expect(screen.getByText("Feb")).toBeInTheDocument();
  });

  it("renders the raw value for each data point", () => {
    render(
      <BarChart
        data={[{ month: "Jan", count: 5 }]}
        labelKey="month"
        valueKey="count"
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("prefixes the value when valuePrefix is given", () => {
    render(
      <BarChart
        data={[{ month: "Jan", count: 500 }]}
        labelKey="month"
        valueKey="count"
        valuePrefix="Rs. "
      />
    );
    expect(screen.getByText("Rs. 500")).toBeInTheDocument();
  });

  it("scales the largest bar to 100% width", () => {
    const { container } = render(
      <BarChart
        data={[
          { month: "Jan", count: 5 },
          { month: "Feb", count: 10 },
        ]}
        labelKey="month"
        valueKey="count"
      />
    );
    const bars = container.querySelectorAll(".bg-green-600");
    expect(bars[1]).toHaveStyle({ width: "100%" });
  });

  it("scales a smaller bar proportionally to the max value", () => {
    const { container } = render(
      <BarChart
        data={[
          { month: "Jan", count: 5 },
          { month: "Feb", count: 10 },
        ]}
        labelKey="month"
        valueKey="count"
      />
    );
    const bars = container.querySelectorAll(".bg-green-600");
    expect(bars[0]).toHaveStyle({ width: "50%" });
  });
});
