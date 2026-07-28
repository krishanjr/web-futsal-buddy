import { ChallengeMongoRepository } from "../repositories/challenge.repository";
import { TeamMongoRepository } from "../repositories/team.repository";
import { NotifyService } from "../repositories/notification.repository";
import { CreateChallengeDTO, CounterChallengeDTO } from "../dtos/challenge.dto";
import { IChallenge } from "../models/challenge.model";
import { HttpException } from "../exceptions/http-exception";

const challengeRepository = new ChallengeMongoRepository();
const teamRepository = new TeamMongoRepository();

export class ChallengeService {
    async sendChallenge(playerId: string, data: CreateChallengeDTO): Promise<IChallenge> {
        const myTeam = await teamRepository.findById(data.challengerTeamId);
        if (!myTeam) throw new HttpException(404, "Your team was not found");
        if (myTeam.organizerId !== playerId) {
            throw new HttpException(403, "Only the team captain can send a challenge on its behalf");
        }

        const opponentTeam = await teamRepository.findById(data.opponentTeamId);
        if (!opponentTeam) throw new HttpException(404, "Opponent team not found");

        if (data.challengerTeamId === data.opponentTeamId) {
            throw new HttpException(400, "A team cannot challenge itself");
        }

        const challenge = await challengeRepository.create({
            challengerTeamId: data.challengerTeamId,
            challengerPlayerId: playerId,
            opponentTeamId: data.opponentTeamId,
            proposedDate: data.proposedDate,
            proposedTime: data.proposedTime,
            preferredFutsalId: data.preferredFutsalId,
            message: data.message,
            status: "pending",
        });

        await NotifyService.send(
            opponentTeam.organizerId,
            "challenge_received",
            `${myTeam.name} challenged your team ${opponentTeam.name} for ${data.proposedDate}`,
            challenge._id.toString()
        );

        return challenge;
    }

    async getMyChallenges(playerId: string) {
        const myTeams = await teamRepository.findByOrganizer(playerId);
        const myTeamIds = myTeams.map((t) => t._id.toString());
        if (myTeamIds.length === 0) return { sent: [], received: [] };

        const all = await challengeRepository.findByTeamIds(myTeamIds);
        const sent = all.filter((c) => myTeamIds.includes(c.challengerTeamId));
        const received = all.filter((c) => myTeamIds.includes(c.opponentTeamId));

        return { sent, received };
    }

    async acceptChallenge(playerId: string, challengeId: string): Promise<IChallenge> {
        const challenge = await this.assertOpponentCaptain(playerId, challengeId);
        this.assertPending(challenge);
        const updated = await challengeRepository.update(challengeId, { status: "accepted" });
        if (!updated) throw new HttpException(500, "Failed to accept challenge");
        await NotifyService.send(
            challenge.challengerPlayerId,
            "challenge_accepted",
            `Your challenge for ${challenge.proposedDate} was accepted!`,
            challengeId
        );
        return updated;
    }

    async rejectChallenge(playerId: string, challengeId: string): Promise<IChallenge> {
        const challenge = await this.assertOpponentCaptain(playerId, challengeId);
        this.assertPending(challenge);
        const updated = await challengeRepository.update(challengeId, { status: "rejected" });
        if (!updated) throw new HttpException(500, "Failed to reject challenge");
        await NotifyService.send(
            challenge.challengerPlayerId,
            "challenge_rejected",
            `Your challenge for ${challenge.proposedDate} was declined`,
            challengeId
        );
        return updated;
    }

    async counterChallenge(
        playerId: string,
        challengeId: string,
        data: CounterChallengeDTO
    ): Promise<IChallenge> {
        const challenge = await this.assertOpponentCaptain(playerId, challengeId);
        this.assertPending(challenge);
        const updated = await challengeRepository.update(challengeId, {
            status: "countered",
            counterDate: data.counterDate,
            counterTime: data.counterTime,
            counterFutsalId: data.counterFutsalId,
        });
        if (!updated) throw new HttpException(500, "Failed to send counter offer");
        await NotifyService.send(
            challenge.challengerPlayerId,
            "challenge_countered",
            `Your opponent proposed a new time: ${data.counterDate} at ${data.counterTime}`,
            challengeId
        );
        return updated;
    }

    async withdrawChallenge(playerId: string, challengeId: string): Promise<IChallenge> {
        const challenge = await challengeRepository.findById(challengeId);
        if (!challenge) throw new HttpException(404, "Challenge not found");
        if (challenge.challengerPlayerId !== playerId) {
            throw new HttpException(403, "Only the sender can withdraw this challenge");
        }
        if (challenge.status !== "pending" && challenge.status !== "countered") {
            throw new HttpException(400, `Challenge is already ${challenge.status}`);
        }
        const updated = await challengeRepository.update(challengeId, { status: "withdrawn" });
        if (!updated) throw new HttpException(500, "Failed to withdraw challenge");
        return updated;
    }

    private assertPending(challenge: IChallenge) {
        if (challenge.status !== "pending") {
            throw new HttpException(400, `Challenge is already ${challenge.status}`);
        }
    }

    private async assertOpponentCaptain(playerId: string, challengeId: string): Promise<IChallenge> {
        const challenge = await challengeRepository.findById(challengeId);
        if (!challenge) throw new HttpException(404, "Challenge not found");
        const opponentTeam = await teamRepository.findById(challenge.opponentTeamId);
        if (!opponentTeam || opponentTeam.organizerId !== playerId) {
            throw new HttpException(403, "Only the challenged team's captain can respond");
        }
        return challenge;
    }
}
