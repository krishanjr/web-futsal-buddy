import { render, screen } from "@testing-library/react";
import FutsalCard from "@/components/player/FutsalCard";
import { makeFutsal } from "../../utils/fixtures";

describe("FutsalCard", () => {
  it("renders the futsal's name", () => {
    render(<FutsalCard futsal={makeFutsal({ name: "City Arena" })} />);
    expect(screen.getByText("City Arena")).toBeInTheDocument();
  });

  it("renders the hourly price", () => {
    render(<FutsalCard futsal={makeFutsal({ pricePerHour: 1500 })} />);
    expect(screen.getByText("Rs. 1500/hr")).toBeInTheDocument();
  });

  it("shows the rating and review count when reviews exist", () => {
    render(<FutsalCard futsal={makeFutsal({ rating: 4.567, reviewCount: 8 })} />);
    expect(screen.getByText("★ 4.6 (8)")).toBeInTheDocument();
  });

  it("hides the rating badge when there are no reviews", () => {
    render(<FutsalCard futsal={makeFutsal({ reviewCount: 0 })} />);
    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
  });

  it("renders district and municipality together", () => {
    render(
      <FutsalCard futsal={makeFutsal({ district: "Bhaktapur", municipality: "Suryabinayak" })} />
    );
    expect(screen.getByText("Bhaktapur, Suryabinayak")).toBeInTheDocument();
  });

  it("renders only the district when municipality is absent", () => {
    render(<FutsalCard futsal={makeFutsal({ district: "Bhaktapur", municipality: undefined })} />);
    expect(screen.getByText("Bhaktapur")).toBeInTheDocument();
  });

  it("shows a '+N more' indicator when there are more than 3 facilities", () => {
    render(
      <FutsalCard
        futsal={makeFutsal({
          facilities: ["Parking", "Cafeteria", "Changing Room", "Washroom", "Flood Lights"],
        })}
      />
    );
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("falls back to an emoji placeholder when there is no image", () => {
    render(<FutsalCard futsal={makeFutsal({ images: [] })} />);
    expect(screen.getByText("🏟️")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders an image when one is provided", () => {
    render(
      <FutsalCard futsal={makeFutsal({ name: "City Arena", images: ["https://example.com/a.jpg"] })} />
    );
    const img = screen.getByRole("img", { name: "City Arena" });
    expect(img).toHaveAttribute("src", "https://example.com/a.jpg");
  });

  it("links to the futsal's detail page", () => {
    render(<FutsalCard futsal={makeFutsal({ _id: "futsal-42" })} />);
    const link = screen.getByRole("link", { name: "View Details" });
    expect(link).toHaveAttribute("href", "/futsals/futsal-42");
  });
});
