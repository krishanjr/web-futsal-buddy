import { TeamMongoRepository } from "../../src/repositories/team.repository";

describe("team repository exports", () => {
    it("exposes the mongo repository constructor for services", () => {
        expect(TeamMongoRepository).toBeDefined();
        expect(new TeamMongoRepository()).toBeInstanceOf(TeamMongoRepository);
    });
});