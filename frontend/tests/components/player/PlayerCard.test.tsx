import { render, screen } from "@testing-library/react";
import PlayerCard from "@/components/player/PlayerCard";
import { makePlayerProfile } from "../../utils/fixtures";

describe("PlayerCard", () => {
  it("renders the player's position and age", () => {
    render(
      <PlayerCard
        player={makePlayerProfile({ position: "forward", age: 22 })}
        ctaLabel="View profile"
      />
    );
    expect(screen.getByText("forward · Age 22")).toBeInTheDocument();
  });

  it("renders the player's city", () => {
    render(<PlayerCard player={makePlayerProfile({ city: "Pokhara" })} ctaLabel="View profile" />);
    expect(screen.getByText("Pokhara")).toBeInTheDocument();
  });

  it("renders the skill level badge", () => {
    render(
      <PlayerCard player={makePlayerProfile({ skillLevel: "advanced" })} ctaLabel="View profile" />
    );
    expect(screen.getByText("advanced")).toBeInTheDocument();
  });

  it("renders the bio when present", () => {
    render(
      <PlayerCard
        player={makePlayerProfile({ bio: "Weekend warrior" })}
        ctaLabel="View profile"
      />
    );
    expect(screen.getByText("\u201cWeekend warrior\u201d")).toBeInTheDocument();
  });

  it("does not render a bio block when bio is absent", () => {
    render(
      <PlayerCard player={makePlayerProfile({ bio: undefined })} ctaLabel="View profile" />
    );
    expect(screen.queryByText(/\u201c/)).not.toBeInTheDocument();
  });

  it("renders match/win/goal stats", () => {
    render(
      <PlayerCard
        player={makePlayerProfile({
          stats: { matchesPlayed: 20, wins: 12, losses: 8, goals: 15, assists: 4 },
        })}
        ctaLabel="View profile"
      />
    );
    expect(screen.getByText("20 matches")).toBeInTheDocument();
    expect(screen.getByText("12 wins")).toBeInTheDocument();
    expect(screen.getByText("15 goals")).toBeInTheDocument();
  });

  it("links the CTA to the player's profile page", () => {
    render(
      <PlayerCard player={makePlayerProfile({ _id: "abc123" })} ctaLabel="Send request" />
    );
    const link = screen.getByRole("link", { name: "Send request" });
    expect(link).toHaveAttribute("href", "/players/abc123");
  });
});
