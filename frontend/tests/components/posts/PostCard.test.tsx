import { render, screen } from "@testing-library/react";
import PostCard from "@/components/posts/PostCard";
import { makePost } from "../../utils/fixtures";

describe("PostCard", () => {
  it("renders the post title", () => {
    render(<PostCard post={makePost({ title: "Need a goalkeeper" })} />);
    expect(screen.getByText("Need a goalkeeper")).toBeInTheDocument();
  });

  it("renders the human-readable post type label", () => {
    render(<PostCard post={makePost({ postType: "team_recruit" })} />);
    expect(screen.getByText("Team Recruiting")).toBeInTheDocument();
  });

  it("renders the post status", () => {
    render(<PostCard post={makePost({ status: "filled" })} />);
    expect(screen.getByText("filled")).toBeInTheDocument();
  });

  it("shows position and slots-needed details for team_recruit posts", () => {
    render(
      <PostCard
        post={makePost({ postType: "team_recruit", position: "goalkeeper", slotsNeeded: 2 })}
      />
    );
    expect(screen.getByText("goalkeeper needed")).toBeInTheDocument();
    expect(screen.getByText("2 spots open")).toBeInTheDocument();
  });

  it("shows the position a player plays for player_seeking_team posts", () => {
    render(
      <PostCard post={makePost({ postType: "player_seeking_team", position: "defender" })} />
    );
    expect(screen.getByText("Plays defender")).toBeInTheDocument();
  });

  it("shows venue/date/time details for opponent_request posts", () => {
    render(
      <PostCard
        post={makePost({
          postType: "opponent_request",
          venue: "Central Arena",
          matchDate: "2026-08-01",
          matchTime: "18:00",
        })}
      />
    );
    expect(screen.getByText("Central Arena · 2026-08-01 at 18:00")).toBeInTheDocument();
  });

  it("renders the description when present", () => {
    render(<PostCard post={makePost({ description: "Bring your own boots" })} />);
    expect(screen.getByText("Bring your own boots")).toBeInTheDocument();
  });

  it("renders children content passed to it", () => {
    render(
      <PostCard post={makePost()}>
        <button type="button">Apply now</button>
      </PostCard>
    );
    expect(screen.getByRole("button", { name: "Apply now" })).toBeInTheDocument();
  });
});
