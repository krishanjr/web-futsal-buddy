import { ChallengeModel, IChallenge } from "../models/challenge.model";

export class ChallengeMongoRepository {
    async create(challenge: Partial<IChallenge>): Promise<IChallenge> {
        return await ChallengeModel.create(challenge);
    }

    async findById(id: string): Promise<IChallenge | null> {
        return await ChallengeModel.findById(id);
    }

    async findByTeamIds(teamIds: string[]): Promise<IChallenge[]> {
        return await ChallengeModel.find({
            $or: [{ challengerTeamId: { $in: teamIds } }, { opponentTeamId: { $in: teamIds } }],
        }).sort({ createdAt: -1 });
    }

    async update(id: string, data: Partial<IChallenge>): Promise<IChallenge | null> {
        return await ChallengeModel.findByIdAndUpdate(id, data, { new: true });
    }

    async findAllForAdmin(skip: number, limit: number): Promise<IChallenge[]> {
        return await ChallengeModel.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    }

    async countAllForAdmin(): Promise<number> {
        return await ChallengeModel.countDocuments();
    }
}
